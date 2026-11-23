import secrets

from django.db import models

from apps.cars.models import Car

REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def generate_reference():
    return "RC-" + "".join(secrets.choice(REFERENCE_ALPHABET) for _ in range(6))


class Booking(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Yangi"
        CONFIRMED = "confirmed", "Bron qilingan"
        REJECTED = "rejected", "Rad etilgan"
        RETURNED = "returned", "Qaytarildi"

    # Holatlar orasidagi ruxsat etilgan o'tishlar (Telegram tugmalari va admin amallari uchun).
    TRANSITIONS = {
        Status.NEW: {Status.CONFIRMED, Status.REJECTED},
        Status.CONFIRMED: {Status.RETURNED, Status.REJECTED},
        Status.REJECTED: set(),
        Status.RETURNED: set(),
    }

    reference = models.CharField("Zayavka raqami", max_length=12, unique=True, editable=False)
    car = models.ForeignKey(Car, verbose_name="Mashina", on_delete=models.PROTECT, related_name="bookings")
    customer_name = models.CharField("Mijoz ismi", max_length=100)
    phone = models.CharField("Telefon", max_length=13, help_text="+998XXXXXXXXX formatida")
    start_date = models.DateField("Olish sanasi")
    end_date = models.DateField("Qaytarish sanasi")
    status = models.CharField("Holati", max_length=20, choices=Status.choices, default=Status.NEW, db_index=True)
    admin_note = models.TextField("Admin izohi", blank=True, help_text="Kelishilgan narx va boshqa shartlar.")
    client_ip = models.GenericIPAddressField("IP manzil", null=True, blank=True, editable=False)
    created_at = models.DateTimeField("Yuborilgan vaqt", auto_now_add=True)
    updated_at = models.DateTimeField("O'zgartirilgan vaqt", auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Bron"
        verbose_name_plural = "Bronlar"
        indexes = [models.Index(fields=("car", "status", "start_date", "end_date"))]
        constraints = [
            models.CheckConstraint(check=models.Q(end_date__gt=models.F("start_date")), name="booking_end_after_start"),
        ]

    def __str__(self):
        return f"{self.reference} — {self.customer_name}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = generate_reference()
            while Booking.objects.filter(reference=self.reference).exists():
                self.reference = generate_reference()
        super().save(*args, **kwargs)

    @property
    def days(self):
        return (self.end_date - self.start_date).days

    def can_change_to(self, new_status):
        return new_status in self.TRANSITIONS.get(self.status, set())

    @property
    def formatted_phone(self):
        p = self.phone
        if len(p) == 13 and p.startswith("+998"):
            return f"{p[:4]} {p[4:6]} {p[6:9]} {p[9:11]} {p[11:]}"
        return p
