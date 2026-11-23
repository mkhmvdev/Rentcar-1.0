from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.bookings.models import Booking

from .models import Car


def make_car(**overrides):
    data = dict(
        name="Chevrolet Cobalt", brand="Chevrolet", car_type="sedan", year=2023, price_per_day=350_000,
        seats=5, transmission="automatic", fuel_type="gas",
    )
    data.update(overrides)
    return Car.objects.create(**data)


def make_booking(car, start, end, status=Booking.Status.CONFIRMED):
    return Booking.objects.create(
        car=car, customer_name="Ali", phone="+998901234567", start_date=start, end_date=end, status=status
    )


class CarApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.today = timezone.localdate()

    def test_list_hides_inactive_cars(self):
        make_car(name="Ko'rinadi")
        make_car(name="Yashirin", is_active=False)
        names = [car["name"] for car in self.client.get("/api/cars/").json()]
        self.assertEqual(names, ["Ko'rinadi"])

    def test_inactive_car_detail_is_404(self):
        car = make_car(is_active=False)
        self.assertEqual(self.client.get(f"/api/cars/{car.id}/").status_code, 404)

    def test_confirmed_booking_covering_today_marks_car_rented(self):
        car = make_car()
        make_booking(car, self.today - timedelta(days=1), self.today + timedelta(days=3))
        data = self.client.get(f"/api/cars/{car.id}/").json()
        self.assertEqual(data["rented_until"], str(self.today + timedelta(days=3)))

    def test_new_rejected_returned_and_future_bookings_do_not_mark_rented(self):
        car = make_car()
        make_booking(car, self.today, self.today + timedelta(days=2), status=Booking.Status.NEW)
        make_booking(car, self.today, self.today + timedelta(days=2), status=Booking.Status.REJECTED)
        make_booking(car, self.today - timedelta(days=2), self.today + timedelta(days=2), status=Booking.Status.RETURNED)
        make_booking(car, self.today + timedelta(days=5), self.today + timedelta(days=7))
        self.assertIsNone(self.client.get("/api/cars/").json()[0]["rented_until"])

    def test_car_is_free_again_after_return_date(self):
        car = make_car()
        make_booking(car, self.today - timedelta(days=5), self.today - timedelta(days=1))
        self.assertIsNone(self.client.get(f"/api/cars/{car.id}/").json()["rented_until"])

    def test_filters_and_sorting(self):
        make_car(name="Arzon", price_per_day=200_000, car_type="sedan", transmission="manual", seats=5)
        make_car(name="Qimmat", price_per_day=900_000, car_type="suv", transmission="automatic", seats=7)
        get_names = lambda query: [c["name"] for c in self.client.get(f"/api/cars/?{query}").json()]
        self.assertEqual(get_names("type=suv"), ["Qimmat"])
        self.assertEqual(get_names("transmission=manual"), ["Arzon"])
        self.assertEqual(get_names("seats=7"), ["Qimmat"])
        self.assertEqual(get_names("sort=-price"), ["Qimmat", "Arzon"])
        self.assertEqual(get_names("type=noma'lum&sort=price"), ["Arzon", "Qimmat"])
