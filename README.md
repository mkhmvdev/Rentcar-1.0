# Rent Car

Ijaraga mashina ko'rish va bron qilish sayti.

Sahifalar: bosh sahifa (6 ta mashina), **Mashinalar** (hammasi, filtrlar bilan), **Biz haqimizda**, **FAQ** (savol-javoblar va savol yuborish formasi), **Profil** (shu qurilmadan yuborilgan zayavkalar va ularning holati).

- Mijoz mashinani tanlaydi, sanalarni, ismi va telefonini qoldiradi.
- Zayavka Telegram botga boradi. Admin mijozga qo'ng'iroq qilib, narxni kelishadi va botda **✅ Bron qilish** yoki **❌ Rad etish** tugmasini bosadi.
- Bron qilingan mashina ijara kunlarida saytda xira ko'rinadi ("Ijarada · 28-noyabrgacha"). Qaytarish sanasi o'tgach o'zi bo'shaydi, admin erta qaytgan mashina uchun **↩️ Mashina qaytarildi** tugmasini bosadi.
- Saytda faqat 1 kunlik narx ko'rsatiladi, platforma narx hisoblamaydi.
- Har bir mashinaning soni bor (masalan, 3 ta Cobalt). Saytda "Mavjud · 2 ta qoldi" yoki "Mavjud emas" ko'rinadi.
- Mashina sahifasidagi kalendarda barcha nusxalari band bo'lgan kunlar ko'rinadi va ularni tanlab bo'lmaydi.
- Zayavka yuborilgach mijoz "Ko'rib chiqilmoqda" holatini ko'radi. Admin botda tasdiqlasa "Tasdiqlandi", rad etsa "Sizning so'rovingiz rad etildi" deb o'zi yangilanadi (`/zayavka` sahifasi).
- Mashinalar soni yetmasa, zayavkani tasdiqlab bo'lmaydi (botda ham, admin panelda ham).
- FAQ sahifasidagi formadan yuborilgan savol bazaga yoziladi va adminga Telegramda (ism familiya, telefon, savol) boradi. Savollar va FAQ matnlari admin panelda boshqariladi.
- **Muhim:** Telegramdagi tugmalar faqat bot ishlab turganda ishlaydi (`npm run dev` uni avtomatik ishga tushiradi yoki alohida `python manage.py run_bot`). Bot o'chiq paytda bosilgan tugmalar Telegramda 24 soatgacha saqlanadi va bot yoqilganda bajariladi.

## Tuzilma

| Qism | Texnologiya | Vazifasi |
|---|---|---|
| `app/`, `components/`, `lib/` | Next.js 16 (server rendering) | Sayt: mashinalar ro'yxati, mashina sahifasi, bron formasi |
| `backend/` | Django 4.2 + DRF | API, admin panel (`/admin/`, django-unfold, o'zbekcha), Telegram bot |

Brauzer faqat Next.js bilan gaplashadi. Next.js server Django API'dan ma'lumot oladi va zayavkani unga yuboradi. Mashina rasmlari `/media/...` orqali Django'dan olinadi.

API:
- `GET /api/cars/` — faol mashinalar (`?type=`, `?transmission=`, `?seats=`, `?sort=price|-price`)
- `GET /api/cars/<id>/` — bitta mashina
- `GET /api/cars/options/` — filtr tanlovlari
- `POST /api/bookings/` — zayavka (`car`, `customer_name`, `phone`, `start_date`, `end_date`)
- `GET /api/bookings/<raqam>/` — zayavka holati (shaxsiy ma'lumotsiz)
- `GET /api/faqs/` — FAQ ro'yxati
- `POST /api/questions/` — mijoz savoli (`full_name`, `phone`, `message`)

Admin panel tarjimalari `backend/locale/uz/` ichida. `.po` faylni o'zgartirgach:

```bash
cd backend && venv/bin/python compile_translations.py
```

## Lokal ishga tushirish

Bir martalik sozlash:

```bash
cd backend
python3 -m venv venv
venv/bin/pip install -r requirements.txt
cp .env.example .env          # TELEGRAM_BOT_TOKEN va TELEGRAM_ADMIN_ID ni to'ldiring
venv/bin/python manage.py migrate
venv/bin/python manage.py createsuperuser
venv/bin/python manage.py seed_cars    # ixtiyoriy: sinov uchun mashinalar
cd ..
cp .env.example .env.local
npm install
```

Har safar — bitta buyruq:

```bash
npm run dev
```

U Django'ni, Telegram botni (agar `backend/.env` da sozlangan bo'lsa) va Next.js'ni birga ishga tushiradi, yangi migratsiyalarni ham o'zi qo'llaydi. Hammasi bitta manzilda:

- Sayt: http://localhost:3000
- Admin panel: http://localhost:3000/admin/

Next.js `/admin/`, `/static/` va `/media/` so'rovlarini ichkarida Django'ga (127.0.0.1:8000) uzatadi, brauzer Django portini ko'rmaydi. Faqat frontendni ishga tushirish: `npm run dev:web`.

`TELEGRAM_ADMIN_ID` — adminning Telegram foydalanuvchi ID raqami (masalan, @userinfobot orqali bilinadi). Admin avval botga `/start` yozgan bo'lishi kerak.

## Testlar

```bash
npm run lint && npm run build
```

```bash
cd backend && venv/bin/python manage.py test
```

## Productionga chiqarish bo'yicha eslatmalar

- `backend/.env`: `DJANGO_DEBUG=False`, uzun tasodifiy `DJANGO_SECRET_KEY`, haqiqiy `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `DB_ENGINE=postgres`.
- Django'ni gunicorn orqali (127.0.0.1:8000), Next.js'ni `npm run build && npm start` orqali ishga tushiring, oldiga nginx qo'ying. Admin panel ham sayt domenidan `/admin/` orqali ochiladi; `DJANGO_CSRF_TRUSTED_ORIGINS` ga sayt manzilini yozing.
- `DEBUG=False` holatda Django `/media/` fayllarini bermaydi — nginx `backend/media/` papkasini `/media/` manzilida bersin.
- `python manage.py collectstatic` (admin panel stillari uchun) va `run_bot` ni systemd xizmati sifatida ishga tushiring.
- `NUM_PROXIES` — Django oldidagi proxy'lar soni (spam cheklovi to'g'ri IP'ni ko'rishi uchun).
