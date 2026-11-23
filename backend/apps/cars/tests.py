from datetime import timedelta

from django.core.exceptions import ValidationError
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
        self.assertEqual(data["available_count"], 0)
        self.assertEqual(data["next_free_date"], str(self.today + timedelta(days=3)))

    def test_new_rejected_returned_and_future_bookings_do_not_mark_rented(self):
        car = make_car()
        make_booking(car, self.today, self.today + timedelta(days=2), status=Booking.Status.NEW)
        make_booking(car, self.today, self.today + timedelta(days=2), status=Booking.Status.REJECTED)
        make_booking(car, self.today - timedelta(days=2), self.today + timedelta(days=2), status=Booking.Status.RETURNED)
        make_booking(car, self.today + timedelta(days=5), self.today + timedelta(days=7))
        data = self.client.get("/api/cars/").json()[0]
        self.assertEqual(data["available_count"], 1)
        self.assertIsNone(data["next_free_date"])

    def test_car_is_free_again_after_return_date(self):
        car = make_car()
        make_booking(car, self.today - timedelta(days=5), self.today - timedelta(days=1))
        self.assertEqual(self.client.get(f"/api/cars/{car.id}/").json()["available_count"], 1)

    def test_quantity_counts_free_units(self):
        car = make_car(quantity=3)
        make_booking(car, self.today, self.today + timedelta(days=2))
        make_booking(car, self.today - timedelta(days=1), self.today + timedelta(days=5))
        data = self.client.get(f"/api/cars/{car.id}/").json()
        self.assertEqual((data["quantity"], data["available_count"], data["next_free_date"]), (3, 1, None))
        make_booking(car, self.today, self.today + timedelta(days=1))
        data = self.client.get("/api/cars/").json()[0]
        self.assertEqual((data["available_count"], data["next_free_date"]), (0, str(self.today + timedelta(days=1))))

    def test_busy_ranges_only_include_fully_booked_days(self):
        car = make_car(quantity=2)
        make_booking(car, self.today + timedelta(days=1), self.today + timedelta(days=5))
        make_booking(car, self.today + timedelta(days=3), self.today + timedelta(days=8))
        data = self.client.get(f"/api/cars/{car.id}/").json()
        self.assertEqual(data["busy_ranges"], [
            {"start": str(self.today + timedelta(days=3)), "end": str(self.today + timedelta(days=5))}
        ])

    def test_plate_hidden_when_several_units(self):
        car = make_car(quantity=2, plate_number="01 A 123 BC")
        self.assertEqual(self.client.get(f"/api/cars/{car.id}/").json()["plate_number"], "")

    def test_filters_and_sorting(self):
        make_car(name="Arzon", price_per_day=200_000, car_type="sedan", transmission="manual", seats=5)
        make_car(name="Qimmat", price_per_day=900_000, car_type="suv", transmission="automatic", seats=7)
        get_names = lambda query: [c["name"] for c in self.client.get(f"/api/cars/?{query}").json()]
        self.assertEqual(get_names("type=suv"), ["Qimmat"])
        self.assertEqual(get_names("transmission=manual"), ["Arzon"])
        self.assertEqual(get_names("seats=7"), ["Qimmat"])
        self.assertEqual(get_names("sort=-price"), ["Qimmat", "Arzon"])
        self.assertEqual(get_names("type=noma'lum&sort=price"), ["Arzon", "Qimmat"])

    def test_detail_lists_busy_ranges_without_customer_data(self):
        car = make_car()
        make_booking(car, self.today + timedelta(days=2), self.today + timedelta(days=4))
        make_booking(car, self.today - timedelta(days=9), self.today - timedelta(days=5))  # o'tib ketgan
        make_booking(car, self.today + timedelta(days=6), self.today + timedelta(days=8), status=Booking.Status.NEW)
        data = self.client.get(f"/api/cars/{car.id}/").json()
        self.assertEqual(data["busy_ranges"], [
            {"start": str(self.today + timedelta(days=2)), "end": str(self.today + timedelta(days=4))}
        ])
        self.assertNotIn("Ali", str(data))


class CarPlateTests(TestCase):
    def test_plate_is_normalized_and_validated(self):
        car = make_car(plate_number="01a 123  bc")
        self.assertEqual(car.plate_number, "01 A 123 BC")
        car.full_clean()
        car.plate_number = "ABC"
        with self.assertRaises(ValidationError):
            car.full_clean()

