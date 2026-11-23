from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from apps.bookings.serializers import normalize_phone

from .models import Faq, Question

QUESTIONS_PER_PHONE_PER_DAY = 5


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ("id", "question", "answer")


class QuestionSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        max_length=120, error_messages={"blank": "Ism familiyangizni kiriting.", "required": "Ism familiyangizni kiriting."}
    )
    phone = serializers.CharField(
        max_length=30, error_messages={"blank": "Telefon raqamini kiriting.", "required": "Telefon raqamini kiriting."}
    )
    message = serializers.CharField(
        max_length=2000,
        error_messages={
            "blank": "Savolingizni yozing.",
            "required": "Savolingizni yozing.",
            "max_length": "Savol 2000 belgidan oshmasin.",
        },
    )

    class Meta:
        model = Question
        fields = ("full_name", "phone", "message")

    def validate_full_name(self, value):
        value = " ".join(value.split())
        if len(value) < 3:
            raise serializers.ValidationError("Ism familiyangizni to'liq kiriting.")
        return value

    def validate_phone(self, value):
        phone = normalize_phone(value)
        since = timezone.now() - timedelta(days=1)
        if Question.objects.filter(phone=phone, created_at__gte=since).count() >= QUESTIONS_PER_PHONE_PER_DAY:
            raise serializers.ValidationError("Bu raqamdan bugun ko'p savol yuborilgan. Javobimizni kuting.")
        return phone

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("Savolingizni batafsilroq yozing.")
        return value
