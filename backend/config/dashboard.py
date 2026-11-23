"""Admin bosh paneli uchun ma'lumotlar (unfold DASHBOARD_CALLBACK)."""

from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from apps.bookings.models import Booking
from apps.cars.models import Car


def _booking_link(booking):
    return format_html(
        '<a class="font-semibold text-primary-600 dark:text-primary-500" style="white-space:nowrap" href="{}">{}</a>',
        reverse("admin:bookings_booking_change", args=(booking.pk,)),
        booking.reference,
    )


def _car_link(car):
    return format_html(
        '<a class="font-semibold text-primary-600 dark:text-primary-500" href="{}">{}</a>',
        reverse("admin:cars_car_change", args=(car.pk,)),
        car.name,
    )


def new_bookings_badge(request):
    count = Booking.objects.filter(status=Booking.Status.NEW).count()
    return count or None


def unanswered_questions_badge(request):
    from apps.support.models import Question

    count = Question.objects.filter(is_answered=False).count()
    return count or None


def dashboard_callback(request, context):
    today = timezone.localdate()
    cars = list(Car.objects.active().with_rental_status())
    total_units = sum(c.quantity for c in cars)
    rented_units = sum(min(c.rented_now, c.quantity) for c in cars)

    new_bookings = Booking.objects.filter(status=Booking.Status.NEW).select_related("car").order_by("created_at")[:10]
    returning = (
        Booking.objects.filter(status=Booking.Status.CONFIRMED, end_date__lte=today)
        .select_related("car")
        .order_by("end_date")[:10]
    )
    starting = (
        Booking.objects.filter(status=Booking.Status.CONFIRMED, start_date__gte=today, start_date__lte=today + timedelta(days=3))
        .select_related("car")
        .order_by("start_date")[:10]
    )

    changelist = reverse("admin:bookings_booking_changelist")
    context.update({
        "kpis": [
            {"title": "Yangi zayavkalar", "value": Booking.objects.filter(status=Booking.Status.NEW).count(),
             "hint": "Javob kutmoqda", "href": f"{changelist}?status__exact=new", "icon": "notifications_active"},
            {"title": "Hozir ijarada", "value": rented_units, "hint": f"{total_units} ta mashinadan",
             "href": f"{changelist}?status__exact=confirmed", "icon": "key"},
            {"title": "Bo'sh mashinalar", "value": total_units - rented_units, "hint": "Bugun berish mumkin",
             "href": reverse("admin:cars_car_changelist") + "?holati=free", "icon": "directions_car"},
            {"title": "Modellar", "value": len(cars), "hint": "Saytda ko'rinadigan",
             "href": reverse("admin:cars_car_changelist"), "icon": "garage"},
        ],
        "new_table": {
            "headers": ["Raqam", "Mijoz", "Telefon", "Mashina", "Sanalar"],
            "rows": [
                [_booking_link(b), b.customer_name, b.formatted_phone, b.car.name,
                 f"{b.start_date:%d.%m} — {b.end_date:%d.%m}"]
                for b in new_bookings
            ],
        },
        "returning_table": {
            "headers": ["Raqam", "Mashina", "Mijoz", "Qaytarish"],
            "rows": [
                [_booking_link(b), b.car.name, f"{b.customer_name} · {b.formatted_phone}",
                 "bugun" if b.end_date == today else format_html('<b class="text-red-600">{} (kechikdi)</b>', f"{b.end_date:%d.%m}")]
                for b in returning
            ],
        },
        "starting_table": {
            "headers": ["Raqam", "Mashina", "Mijoz", "Olib ketish"],
            "rows": [
                [_booking_link(b), b.car.name, f"{b.customer_name} · {b.formatted_phone}",
                 "bugun" if b.start_date == today else f"{b.start_date:%d.%m}"]
                for b in starting
            ],
        },
        "fleet_table": {
            "headers": ["Mashina", "Soni", "Bo'sh", "Holat"],
            "rows": [
                [_car_link(c), c.quantity, c.available_now,
                 "Hammasi band" if c.available_now == 0 else ("Qisman band" if c.available_now < c.quantity else "Bo'sh")]
                for c in cars
            ],
        },
    })
    return context
