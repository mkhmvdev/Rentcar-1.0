import re
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import serializers

from apps.cars.models import Car

from .models import Booking

MAX_DAYS_AHEAD = 365
MAX_RENTAL_DAYS = 90


def normalize_phone(value):
    """Har xil yozilgan raqamni +998XXXXXXXXX ko'rinishiga keltiradi."""
    digits = re.sub(r"\D", "", value or "")
    if len(digits) == 9:
        digits = "998" + digits
    if len(digits) != 12 or not digits.startswith("998"):
        raise serializers.ValidationError("Telefon raqamini +998 90 123 45 67 ko'rinishida kiriting.")
    return "+" + digits


class BookingCreateSerializer(serializers.ModelSerializer):
    car = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.active(),
        error_messages={"does_not_exist": "Bu mashina topilmadi yoki saytdan olib tashlangan."},
    )
    customer_name = serializers.CharField(
        max_length=100, error_messages={"blank": "Ismingizni kiriting.", "required": "Ismingizni kiriting."}
    )
    phone = serializers.CharField(
        max_length=30, error_messages={"blank": "Telefon raqamini kiriting.", "required": "Telefon raqamini kiriting."}
    )
    start_date = serializers.DateField(error_messages={"invalid": "Olish sanasini tanlang.", "required": "Olish sanasini tanlang."})
    end_date = serializers.DateField(error_messages={"invalid": "Qaytarish sanasini tanlang.", "required": "Qaytarish sanasini tanlang."})

    class Meta:
        model = Booking
        fields = ("car", "customer_name", "phone", "start_date", "end_date")

    def validate_customer_name(self, value):
        value = " ".join(value.split())
        if len(value) < 2:
            raise serializers.ValidationError("Ismingizni to'liq kiriting.")
        return value

    def validate_phone(self, value):
        phone = normalize_phone(value)
        since = timezone.now() - timedelta(days=1)
        if Booking.objects.filter(phone=phone, created_at__gte=since).count() >= settings.BOOKINGS_PER_PHONE_PER_DAY:
            raise serializers.ValidationError(
                "Bu raqamdan bugun bir nechta zayavka yuborilgan. Iltimos, biz qo'ng'iroq qilishimizni kuting."
            )
        return phone

    def validate(self, attrs):
        today = timezone.localdate()
        start, end = attrs["start_date"], attrs["end_date"]
        errors = {}
        if start < today:
            errors["start_date"] = "O'tgan sanani tanlab bo'lmaydi."
        elif start > today + timedelta(days=MAX_DAYS_AHEAD):
            errors["start_date"] = "Bron ko'pi bilan bir yil oldin qilinadi."
        if end <= start:
            errors["end_date"] = "Qaytarish sanasi olish sanasidan keyin bo'lishi kerak."
        elif (end - start).days > MAX_RENTAL_DAYS:
            errors["end_date"] = f"Saytdan ko'pi bilan {MAX_RENTAL_DAYS} kunga bron qilinadi. Uzoqroq muddat uchun qo'ng'iroq qiling."
        if errors:
            raise serializers.ValidationError(errors)
        full_days = attrs["car"].fully_booked_days(start, end)
        if full_days:
            raise serializers.ValidationError({
                "start_date": f"Bu mashina {full_days[0]:%d.%m} kuni band (barcha nusxalari ijarada). Boshqa sanani tanlang."
            })
        return attrs


class BookingCreatedSerializer(serializers.ModelSerializer):
    car_name = serializers.CharField(source="car.name")

    class Meta:
        model = Booking
        fields = ("reference", "car_name", "customer_name", "start_date", "end_date", "status")


class BookingStatusSerializer(serializers.ModelSerializer):
    """Mijozga zayavka holatini ko'rsatish uchun: shaxsiy ma'lumotlarsiz."""

    car_id = serializers.IntegerField(source="car.id")
    car_name = serializers.CharField(source="car.name")

    class Meta:
        model = Booking
        fields = ("reference", "car_id", "car_name", "start_date", "end_date", "status", "updated_at")
