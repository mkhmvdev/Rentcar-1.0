from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Max, OuterRef, Subquery
from django.utils import timezone


class CarQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def with_rental_status(self, today=None):
        """`rented_until` maydonini qo'shadi: mashina bugun ijarada bo'lsa, qaytarish sanasi, aks holda None."""
        from apps.bookings.models import Booking

        today = today or timezone.localdate()
        current_rentals = (
            Booking.objects.filter(
                car=OuterRef("pk"),
                status=Booking.Status.CONFIRMED,
                start_date__lte=today,
                end_date__gte=today,
            )
            .values("car")
            .annotate(until=Max("end_date"))
            .values("until")
        )
        return self.annotate(rented_until=Subquery(current_rentals, output_field=models.DateField()))


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
