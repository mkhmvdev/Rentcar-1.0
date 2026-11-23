import re

from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from datetime import timedelta

from django.db.models import Count, Min, OuterRef, Subquery
from django.db.models.functions import Coalesce
from django.utils import timezone


def normalize_plate(value):
    """'01a123bc' -> '01 A 123 BC', '01123abc' -> '01 123 ABC'. Tanilmagan qiymat o'zgarmaydi."""
    compact = "".join((value or "").upper().split())
    match = re.fullmatch(r"(\d{2})([A-Z])(\d{3})([A-Z]{2})", compact) or re.fullmatch(r"(\d{2})(\d{3})([A-Z]{3})", compact)
    return " ".join(match.groups()) if match else " ".join((value or "").upper().split())


class CarQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def with_rental_status(self, today=None):
        """Bugungi holatni qo'shadi.

        - `rented_now`: bugun ijarada turgan nusxalar soni (tasdiqlangan bronlar);
        - `next_free_date`: hozirgi ijaralardan eng birinchi qaytadiganining sanasi.
        """
        from apps.bookings.models import Booking

        today = today or timezone.localdate()
        current = Booking.objects.filter(
            car=OuterRef("pk"), status=Booking.Status.CONFIRMED, start_date__lte=today, end_date__gte=today
        ).values("car")
        return self.annotate(
            rented_now=Coalesce(Subquery(current.annotate(n=Count("pk")).values("n"), output_field=models.IntegerField()), 0),
            next_free_date=Subquery(current.annotate(d=Min("end_date")).values("d"), output_field=models.DateField()),
        )


class Car(models.Model):
    class CarType(models.TextChoices):
        SEDAN = "sedan", "Sedan"
        SUV = "suv", "Krossover / SUV"
        HATCHBACK = "hatchback", "Xetchbek"
        MINIVAN = "minivan", "Miniven"
        PICKUP = "pickup", "Pikap"
        SPORT = "sport", "Sport"

    class Transmission(models.TextChoices):
        AUTOMATIC = "automatic", "Avtomat"
        MANUAL = "manual", "Mexanika"

    class FuelType(models.TextChoices):
        PETROL = "petrol", "Benzin"
        GAS = "gas", "Benzin / gaz"
        DIESEL = "diesel", "Dizel"
        HYBRID = "hybrid", "Gibrid"
        ELECTRIC = "electric", "Elektr"

    name = models.CharField("Nomi", max_length=120, help_text="Masalan: Chevrolet Malibu 2")
    brand = models.CharField("Brend", max_length=60)
    car_type = models.CharField("Turi", max_length=20, choices=CarType.choices)
    year = models.PositiveSmallIntegerField(
        "Yili", validators=[MinValueValidator(1990), MaxValueValidator(2100)]
    )
    price_per_day = models.PositiveIntegerField("1 kunlik narx (so'm)")
    seats = models.PositiveSmallIntegerField(
        "O'rindiqlar soni", default=5, validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    transmission = models.CharField("Uzatmalar qutisi", max_length=20, choices=Transmission.choices)
    fuel_type = models.CharField("Yoqilg'i", max_length=20, choices=FuelType.choices)
    color = models.CharField("Rangi", max_length=40, blank=True)
    quantity = models.PositiveSmallIntegerField(
        "Soni",
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text="Parkda shu modeldan nechta bor. Saytda \"Mavjud · N ta qoldi\" shu son bo'yicha hisoblanadi.",
    )
    plate_number = models.CharField(
        "Davlat raqami",
        max_length=12,
        blank=True,
        validators=[
            RegexValidator(
                r"^\d{2} ?([A-Z] ?\d{3} ?[A-Z]{2}|\d{3} ?[A-Z]{3})$",
                "Raqamni 01 A 123 BC yoki 01 123 ABC ko'rinishida kiriting (lotin harflari).",
                flags=re.IGNORECASE,
            )
        ],
        help_text="Faqat soni 1 ta bo'lsa saytda raqam belgisi ko'rinishida chiqadi. Masalan: 01 A 123 BC",
    )
    description = models.TextField("Tavsif", blank=True)
    image = models.ImageField("Asosiy rasm", upload_to="cars/", blank=True)
    is_active = models.BooleanField(
        "Saytda ko'rinadi", default=True, help_text="O'chirilsa, mashina saytdan yashiriladi."
    )
    sort_order = models.PositiveSmallIntegerField("Tartib", default=0, help_text="Kichik raqam oldinda chiqadi.")
    created_at = models.DateTimeField("Qo'shilgan vaqt", auto_now_add=True)

    objects = CarQuerySet.as_manager()

    class Meta:
        ordering = ("sort_order", "-created_at")
        verbose_name = "Mashina"
        verbose_name_plural = "Mashinalar"

    def __str__(self):
        return f"{self.name} ({self.year})"

    def save(self, *args, **kwargs):
        self.plate_number = normalize_plate(self.plate_number)
        super().save(*args, **kwargs)

    @property
    def available_now(self):
        """Bugun bo'sh nusxalar soni. `with_rental_status()` bilan olingan bo'lsa qo'shimcha so'rov yubormaydi."""
        rented = getattr(self, "rented_now", None)
        if rented is None:
            from apps.bookings.models import Booking

            today = timezone.localdate()
            rented = self.bookings.filter(
                status=Booking.Status.CONFIRMED, start_date__lte=today, end_date__gte=today
            ).count()
        return max(0, self.quantity - rented)

    def booked_counts(self, start, end):
        """{sana: shu kuni band nusxalar soni} — faqat tasdiqlangan bronlar, [start, end] oralig'ida."""
        from apps.bookings.models import Booking

        counts = {}
        for b_start, b_end in self.bookings.filter(
            status=Booking.Status.CONFIRMED, start_date__lte=end, end_date__gte=start
        ).values_list("start_date", "end_date"):
            day = max(b_start, start)
            while day <= min(b_end, end):
                counts[day] = counts.get(day, 0) + 1
                day += timedelta(days=1)
        return counts

    def fully_booked_days(self, start, end):
        return sorted(day for day, n in self.booked_counts(start, end).items() if n >= self.quantity)

    def busy_ranges(self, today=None, horizon_days=366):
        """Barcha nusxalari band bo'lgan kunlar, oraliqlarga birlashtirilgan. Mijoz ma'lumoti qaytarilmaydi."""
        today = today or timezone.localdate()
        ranges = []
        for day in self.fully_booked_days(today, today + timedelta(days=horizon_days)):
            if ranges and ranges[-1]["end_date"] + timedelta(days=1) == day:
                ranges[-1]["end_date"] = day
            else:
                ranges.append({"start_date": day, "end_date": day})
        return ranges


class CarImage(models.Model):
    car = models.ForeignKey(Car, verbose_name="Mashina", on_delete=models.CASCADE, related_name="images")
    image = models.ImageField("Rasm", upload_to="cars/gallery/")
    sort_order = models.PositiveSmallIntegerField("Tartib", default=0)

    class Meta:
        ordering = ("sort_order", "id")
        verbose_name = "Qo'shimcha rasm"
        verbose_name_plural = "Qo'shimcha rasmlar"

    def __str__(self):
        return f"{self.car} — rasm #{self.pk}"
