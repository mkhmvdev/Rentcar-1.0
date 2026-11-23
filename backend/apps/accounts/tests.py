from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from apps.bookings.models import Booking
from apps.cars.tests import make_car


class AdminPagesTests(TestCase):
    """Admin panel sahifalari ochiladi va o'zbek tilida."""

    def setUp(self):
        self.client.force_login(User.objects.create_superuser("admin", password="x"))
        self.car = make_car(quantity=2, plate_number="01 A 123 BC")
        today = timezone.localdate()
        self.booking = Booking.objects.create(car=self.car, customer_name="Ali", phone="+998901234567",
                                              start_date=today, end_date=today + timedelta(days=2))

    def test_pages_render_in_uzbek(self):
        pages = [
            "/admin/",
            "/admin/cars/car/",
            "/admin/cars/car/?holati=free",
            "/admin/cars/car/add/",
            f"/admin/cars/car/{self.car.pk}/change/",
            "/admin/bookings/booking/",
            f"/admin/bookings/booking/{self.booking.pk}/change/",
            "/admin/auth/user/",
            "/admin/support/question/",
            "/admin/support/faq/",
        ]
        for url in pages:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                html = response.content.decode()
                for english in ("Site administration", "Save and continue editing", "Select action", "Filters"):
                    self.assertNotIn(english, html)
        self.assertContains(self.client.get("/admin/"), "Yangi zayavkalar")

    def test_detail_action_confirms_booking(self):
        url = reverse("admin:bookings_booking_detail_confirm", args=(self.booking.pk,))
        response = self.client.get(url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)
