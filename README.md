# Rent Car

Ijaraga mashina ko'rish va bron qilish sayti.

- Mijoz mashinani tanlaydi, sanalarni, ismi va telefonini qoldiradi.
- Zayavka Telegram botga boradi. Admin mijozga qo'ng'iroq qilib, narxni kelishadi va botda **✅ Bron qilish** yoki **❌ Rad etish** tugmasini bosadi.
- Bron qilingan mashina ijara kunlarida saytda xira ko'rinadi ("Ijarada · 28-noyabrgacha"). Qaytarish sanasi o'tgach o'zi bo'shaydi, admin erta qaytgan mashina uchun **↩️ Mashina qaytarildi** tugmasini bosadi.
- Saytda faqat 1 kunlik narx ko'rsatiladi, platforma narx hisoblamaydi.

## Tuzilma

| Qism | Texnologiya | Vazifasi |
|---|---|---|
| `app/`, `components/`, `lib/` | Next.js 16 (server rendering) | Sayt: mashinalar ro'yxati, mashina sahifasi, bron formasi |
| `backend/` | Django 4.2 + DRF | API, admin panel (`/admin/`), Telegram bot |

Brauzer faqat Next.js bilan gaplashadi. Next.js server Django API'dan ma'lumot oladi va zayavkani unga yuboradi. Mashina rasmlari `/media/...` orqali Django'dan olinadi.

API:
- `GET /api/cars/` — faol mashinalar (`?type=`, `?transmission=`, `?seats=`, `?sort=price|-price`)
- `GET /api/cars/<id>/` — bitta mashina
- `GET /api/cars/options/` — filtr tanlovlari
- `POST /api/bookings/` — zayavka (`car`, `customer_name`, `phone`, `start_date`, `end_date`)

## Lokal ishga tushirish

1. Backend:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # TELEGRAM_BOT_TOKEN va TELEGRAM_ADMIN_ID ni to'ldiring
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_cars    # ixtiyoriy: sinov uchun 6 ta mashina
python manage.py runserver 8000
```

2. Telegram bot (alohida terminalda):

```bash
cd backend && source venv/bin/activate && python manage.py run_bot
```

`TELEGRAM_ADMIN_ID` — adminning Telegram foydalanuvchi ID raqami (masalan, @userinfobot orqali bilinadi). Admin avval botga `/start` yozgan bo'lishi kerak.

3. Frontend (loyiha ildizida):

```bash
cp .env.example .env.local
npm install
npm run dev
```

Sayt: http://localhost:3000, admin panel: http://localhost:8000/admin/

## Testlar

```bash
npm run lint && npm run build
```

```bash
cd backend && venv/bin/python manage.py test
```

## Productionga chiqarish bo'yicha eslatmalar

- `backend/.env`: `DJANGO_DEBUG=False`, uzun tasodifiy `DJANGO_SECRET_KEY`, haqiqiy `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `DB_ENGINE=postgres`.
- Django'ni gunicorn orqali, Next.js'ni `npm run build && npm start` orqali ishga tushiring, oldiga nginx qo'ying.
- `DEBUG=False` holatda Django `/media/` fayllarini bermaydi — nginx `backend/media/` papkasini `/media/` manzilida bersin.
- `python manage.py collectstatic` (admin panel stillari uchun) va `run_bot` ni systemd xizmati sifatida ishga tushiring.
- `NUM_PROXIES` — Django oldidagi proxy'lar soni (spam cheklovi to'g'ri IP'ni ko'rishi uchun).
