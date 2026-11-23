from datetime import timedelta
from unittest import mock

from django.core.cache import cache
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from apps.cars.tests import make_car

from . import telegram
from .models import Booking


class BookingApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.car = make_car()
        self.today = timezone.localdate()

    def payload(self, **overrides):
        data = {
            "car": self.car.id,
            "customer_name": "  Ali   Valiyev ",
            "phone": "+998 (90) 123-45-67",
            "start_date": str(self.today + timedelta(days=1)),
            "end_date": str(self.today + timedelta(days=3)),
        }
        data.update(overrides)
        return data

    @mock.patch("apps.bookings.views.notify_new_booking")
    def test_creates_booking_and_notifies_admin(self, notify):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post("/api/bookings/", self.payload(), format="json", REMOTE_ADDR="10.0.0.5")
        self.assertEqual(response.status_code, 201, response.json())
        booking = Booking.objects.get()
        self.assertEqual(booking.status, Booking.Status.NEW)
        self.assertEqual(booking.phone, "+998901234567")
        self.assertEqual(booking.customer_name, "Ali Valiyev")
        self.assertTrue(booking.reference.startswith("RC-"))
        self.assertEqual(response.json()["reference"], booking.reference)
        notify.assert_called_once_with(booking.pk)

    def test_accepts_nine_digit_local_phone(self):
        response = self.client.post("/api/bookings/", self.payload(phone="90 123 45 67"), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Booking.objects.get().phone, "+998901234567")

    def test_rejects_bad_input(self):
        cases = {
            "phone": self.payload(phone="12345"),
            "start_date": self.payload(start_date=str(self.today - timedelta(days=1))),
            "end_date": self.payload(end_date=str(self.today + timedelta(days=1))),
            "customer_name": self.payload(customer_name=" "),
        }
        for field, data in cases.items():
            with self.subTest(field=field):
                response = self.client.post("/api/bookings/", data, format="json")
                self.assertEqual(response.status_code, 400)
                self.assertIn(field, response.json())
        self.assertFalse(Booking.objects.exists())

    def test_rejects_hidden_car(self):
        hidden = make_car(name="Yashirin", is_active=False)
        response = self.client.post("/api/bookings/", self.payload(car=hidden.id), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("car", response.json())

    def test_rented_car_still_accepts_requests(self):
        Booking.objects.create(car=self.car, customer_name="B", phone="+998901111111",
                               start_date=self.today, end_date=self.today + timedelta(days=2),
                               status=Booking.Status.CONFIRMED)
        response = self.client.post("/api/bookings/", self.payload(), format="json")
        self.assertEqual(response.status_code, 201)

    @override_settings(BOOKINGS_PER_PHONE_PER_DAY=2)
    def test_limits_requests_per_phone(self):
        for _ in range(2):
            self.assertEqual(self.client.post("/api/bookings/", self.payload(), format="json").status_code, 201)
        response = self.client.post("/api/bookings/", self.payload(), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone", response.json())

    def test_client_cannot_set_status(self):
        response = self.client.post("/api/bookings/", self.payload(status="confirmed"), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Booking.objects.get().status, Booking.Status.NEW)

    def test_only_post_is_allowed(self):
        self.assertEqual(self.client.get("/api/bookings/").status_code, 405)


@override_settings(TELEGRAM_BOT_TOKEN="test-token", TELEGRAM_ADMIN_ID="111")
class TelegramTests(TestCase):
    def setUp(self):
        today = timezone.localdate()
        self.booking = Booking.objects.create(
            car=make_car(), customer_name="Ali", phone="+998901234567",
            start_date=today, end_date=today + timedelta(days=2),
        )

    def callback(self, data, user_id=111):
        return {"id": "cb1", "from": {"id": user_id}, "data": data,
                "message": {"message_id": 5, "chat": {"id": 111}}}

    @mock.patch.object(telegram, "call_api")
    def test_new_booking_message_has_confirm_and_reject_buttons(self, call_api):
        telegram.notify_new_booking(self.booking.pk)
        method, payload = call_api.call_args.args
        self.assertEqual(method, "sendMessage")
        self.assertEqual(payload["chat_id"], "111")
        self.assertIn("+998 90 123 45 67", payload["text"])
        self.assertIn("350 000 so'm", payload["text"])
        callbacks = [b["callback_data"] for b in payload["reply_markup"]["inline_keyboard"][0]]
        self.assertEqual(callbacks, [f"confirm:{self.booking.pk}", f"reject:{self.booking.pk}"])

    @mock.patch.object(telegram, "call_api")
    def test_admin_confirms_then_marks_returned(self, call_api):
        telegram.handle_callback(self.callback(f"confirm:{self.booking.pk}"))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)
        edit_payload = call_api.call_args_list[-1].args[1]
        self.assertEqual(edit_payload["reply_markup"]["inline_keyboard"][0][0]["callback_data"], f"return:{self.booking.pk}")

        telegram.handle_callback(self.callback(f"return:{self.booking.pk}"))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.RETURNED)

    @mock.patch.object(telegram, "call_api")
    def test_stranger_cannot_change_status(self, call_api):
        telegram.handle_callback(self.callback(f"confirm:{self.booking.pk}", user_id=999))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.NEW)

    @mock.patch.object(telegram, "call_api")
    def test_invalid_transition_is_ignored(self, call_api):
        telegram.handle_callback(self.callback(f"return:{self.booking.pk}"))
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.NEW)

    @mock.patch.object(telegram, "call_api", side_effect=telegram.TelegramError("down"))
    def test_telegram_failure_does_not_raise(self, call_api):
        telegram.notify_new_booking(self.booking.pk)  # faqat logga yozadi
