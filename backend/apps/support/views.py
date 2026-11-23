import ipaddress
import logging

from django.conf import settings
from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.bookings.telegram import TelegramError, call_api

from .models import Faq, Question
from .serializers import FaqSerializer, QuestionSerializer

logger = logging.getLogger(__name__)


def question_text(question):
    return "\n".join([
        f"❓ Yangi savol #{question.pk}",
        "",
        f"👤 {question.full_name}",
        f"📞 {question.formatted_phone}",
        "",
        f"💬 {question.message}",
    ])


def notify_new_question(question_id):
    """Savolni adminga Telegramda yuboradi. Xato bo'lsa faqat logga yoziladi — savol bazada saqlangan."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_ID:
        logger.warning("Savol #%s Telegramga yuborilmadi: bot sozlanmagan", question_id)
        return
    try:
        question = Question.objects.get(pk=question_id)
        call_api("sendMessage", {"chat_id": settings.TELEGRAM_ADMIN_ID, "text": question_text(question)})
    except (Question.DoesNotExist, TelegramError):
        logger.exception("Savol #%s Telegramga yuborilmadi", question_id)


class FaqListView(generics.ListAPIView):
    serializer_class = FaqSerializer
    queryset = Faq.objects.filter(is_active=True)


class QuestionCreateView(APIView):
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "questions"

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ident = ScopedRateThrottle().get_ident(request)
        try:
            ip = str(ipaddress.ip_address(ident))
        except ValueError:
            ip = None
        with transaction.atomic():
            question = serializer.save(client_ip=ip)
            transaction.on_commit(lambda: notify_new_question(question.pk))
        return Response({"detail": "Savolingiz yuborildi."}, status=status.HTTP_201_CREATED)
