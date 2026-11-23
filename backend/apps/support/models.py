from django.db import models


class Faq(models.Model):
    """FAQ sahifasidagi savol-javob. Admin paneldan qo'shiladi va tahrirlanadi."""

    question = models.CharField("Savol", max_length=255)
    answer = models.TextField("Javob")
    sort_order = models.PositiveSmallIntegerField("Tartib", default=0, help_text="Kichik raqam yuqorida chiqadi.")
    is_active = models.BooleanField("Saytda ko'rinadi", default=True)

    class Meta:
        ordering = ("sort_order", "id")
        verbose_name = "Savol-javob (FAQ)"
        verbose_name_plural = "Savol-javoblar (FAQ)"

    def __str__(self):
        return self.question


class Question(models.Model):
    """FAQ sahifasidagi forma orqali mijoz yuborgan savol."""

    full_name = models.CharField("Ism familiya", max_length=120)
    phone = models.CharField("Telefon", max_length=13)
    message = models.TextField("Savol")
    is_answered = models.BooleanField("Javob berildi", default=False)
    admin_note = models.TextField("Admin izohi", blank=True)
    client_ip = models.GenericIPAddressField("IP manzil", null=True, blank=True, editable=False)
    created_at = models.DateTimeField("Yuborilgan vaqt", auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Mijoz savoli"
        verbose_name_plural = "Mijoz savollari"

    def __str__(self):
        return f"{self.full_name} — {self.message[:40]}"

    @property
    def formatted_phone(self):
        p = self.phone
        if len(p) == 13 and p.startswith("+998"):
            return f"{p[:4]} {p[4:6]} {p[6:9]} {p[9:11]} {p[11:]}"
        return p
