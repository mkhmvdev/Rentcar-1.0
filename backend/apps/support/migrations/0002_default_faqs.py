from django.db import migrations

DEFAULT_FAQS = [
    ("Mashinani qanday bron qilaman?",
     "Mashinani tanlang, kalendarda olish va qaytarish kunlarini belgilang, ismingiz va telefon raqamingizni qoldiring. "
     "Administrator qo'ng'iroq qilib, narx va shartlarni kelishadi."),
    ("Narx qanday hisoblanadi?",
     "Saytda 1 kunlik narx ko'rsatilgan. Yakuniy narx ijara muddati va shartlarga qarab telefonda kelishiladi."),
    ("Qanday hujjatlar kerak?",
     "Pasport va haydovchilik guvohnomasi. Batafsil ma'lumotni administrator qo'ng'iroq paytida aytadi."),
    ("To'lov qachon va qanday amalga oshiriladi?",
     "Saytda to'lov olinmaydi. To'lov mashinani topshirish paytida kelishilgan usulda amalga oshiriladi."),
    ("Zayavkam tasdiqlanganini qanday bilaman?",
     "Zayavka holati saytda avtomatik yangilanadi: \"Ko'rib chiqilmoqda\", keyin \"Tasdiqlandi\" yoki rad etilgani haqida xabar chiqadi. "
     "Barcha zayavkalaringizni \"Profil\" sahifasida ko'rishingiz mumkin."),
]


def create(apps, schema_editor):
    Faq = apps.get_model("support", "Faq")
    if not Faq.objects.exists():
        for order, (question, answer) in enumerate(DEFAULT_FAQS):
            Faq.objects.create(question=question, answer=answer, sort_order=order)


class Migration(migrations.Migration):
    dependencies = [("support", "0001_initial")]
    operations = [migrations.RunPython(create, migrations.RunPython.noop)]
