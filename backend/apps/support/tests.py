from unittest import mock

from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Faq, Question
from .views import notify_new_question


class FaqApiTests(TestCase):
    def test_lists_only_active_faqs_in_order(self):
        Faq.objects.all().delete()
        Faq.objects.create(question="Ikkinchi", answer="b", sort_order=2)
        Faq.objects.create(question="Birinchi", answer="a", sort_order=1)
        Faq.objects.create(question="Yashirin", answer="c", is_active=False)
        data = APIClient().get("/api/faqs/").json()
        self.assertEqual([f["question"] for f in data], ["Birinchi", "Ikkinchi"])

    def test_default_faqs_exist_after_migration(self):
        self.assertTrue(Faq.objects.exists())


class QuestionApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    @mock.patch("apps.support.views.notify_new_question")
    def test_saves_question_and_notifies_admin(self, notify):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post("/api/questions/", {
                "full_name": "  Ali   Valiyev ", "phone": "90 123 45 67", "message": "Mashinani aeroportga olib kelasizmi?",
            }, format="json")
        self.assertEqual(response.status_code, 201)
        question = Question.objects.get()
        self.assertEqual((question.full_name, question.phone), ("Ali Valiyev", "+998901234567"))
        notify.assert_called_once_with(question.pk)

    def test_validation_errors(self):
        response = self.client.post("/api/questions/", {"full_name": "A", "phone": "123", "message": "?"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(set(response.json()), {"full_name", "phone", "message"})
        self.assertFalse(Question.objects.exists())

    @override_settings(TELEGRAM_BOT_TOKEN="t", TELEGRAM_ADMIN_ID="111")
    @mock.patch("apps.support.views.call_api")
    def test_telegram_message_has_name_phone_and_question(self, call_api):
        question = Question.objects.create(full_name="Ali Valiyev", phone="+998901234567", message="Depozit qancha?")
        notify_new_question(question.pk)
        method, payload = call_api.call_args.args
        self.assertEqual((method, payload["chat_id"]), ("sendMessage", "111"))
        for part in ("Ali Valiyev", "+998 90 123 45 67", "Depozit qancha?"):
            self.assertIn(part, payload["text"])
