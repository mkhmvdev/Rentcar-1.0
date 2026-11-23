"""Rent Car backend sozlamalari. Qiymatlar backend/.env faylidan o'qiladi."""

from pathlib import Path

from decouple import Csv, config

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = config("DJANGO_DEBUG", default=False, cast=bool)
SECRET_KEY = config("DJANGO_SECRET_KEY", default="dev-only-insecure-key" if DEBUG else "")
if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY .env faylida sozlanishi kerak.")

ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())
# Admin panel sayt manzili orqali ochiladi (Next.js uni Django'ga uzatadi), shu manzil ishonchli bo'lishi kerak.
CSRF_TRUSTED_ORIGINS = config(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default="http://localhost:3000,http://127.0.0.1:3000" if DEBUG else "",
    cast=Csv(),
)

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "apps.accounts",
    "apps.cars",
    "apps.bookings",
    "apps.support",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

if config("DB_ENGINE", default="sqlite") == "postgres":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config("DB_NAME", default="rentcar"),
            "USER": config("DB_USER", default="rentcar"),
            "PASSWORD": config("DB_PASSWORD", default=""),
            "HOST": config("DB_HOST", default="127.0.0.1"),
            "PORT": config("DB_PORT", default="5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True
# Admin panel tarjimalari (Django + unfold). O'zgartirgach: venv/bin/python compile_translations.py
LOCALE_PATHS = [BASE_DIR / "locale"]

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    # Sayt ochiq: login yo'q, API faqat o'qish va zayavka yuborish uchun.
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_THROTTLE_RATES": {
        "bookings": config("BOOKING_RATE_LIMIT", default="10/hour"),
        "booking_status": "120/minute",
        "questions": config("QUESTION_RATE_LIMIT", default="10/hour"),
    },
    # Next.js server so'rovni yuboradi va mijoz IP manzilini X-Forwarded-For'da beradi.
    "NUM_PROXIES": config("NUM_PROXIES", default=1, cast=int),
}

# Bitta telefon raqamidan bir kunda qabul qilinadigan zayavkalar soni.
BOOKINGS_PER_PHONE_PER_DAY = config("BOOKINGS_PER_PHONE_PER_DAY", default=3, cast=int)

TELEGRAM_BOT_TOKEN = config("TELEGRAM_BOT_TOKEN", default="")
TELEGRAM_ADMIN_ID = config("TELEGRAM_ADMIN_ID", default="")

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}


# ---------- Admin panel (django-unfold) ----------
from django.urls import reverse_lazy  # noqa: E402

UNFOLD = {
    "SITE_TITLE": "Rent Car admin",
    "SITE_HEADER": "Rent Car",
    "SITE_SUBHEADER": "Boshqaruv paneli",
    "SITE_URL": "/",
    "SITE_SYMBOL": "directions_car",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": False,
    "DASHBOARD_CALLBACK": "config.dashboard.dashboard_callback",
    "BORDER_RADIUS": "8px",
    "COLORS": {
        # Jiddiy to'q ko'k (navy) palitra
        "primary": {
            "50": "oklch(97.0% .014 254.604)",
            "100": "oklch(93.2% .032 255.585)",
            "200": "oklch(88.2% .059 254.128)",
            "300": "oklch(80.9% .105 251.813)",
            "400": "oklch(70.7% .165 254.624)",
            "500": "oklch(62.3% .214 259.815)",
            "600": "oklch(54.6% .245 262.881)",
            "700": "oklch(48.8% .243 264.376)",
            "800": "oklch(42.4% .199 265.638)",
            "900": "oklch(37.9% .146 265.522)",
            "950": "oklch(28.2% .091 267.935)",
        },
    },
    "SIDEBAR": {
        "show_search": False,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "Asosiy",
                "items": [
                    {"title": "Bosh panel", "icon": "dashboard", "link": reverse_lazy("admin:index")},
                ],
            },
            {
                "title": "Ijara",
                "items": [
                    {
                        "title": "Zayavkalar",
                        "icon": "assignment",
                        "link": reverse_lazy("admin:bookings_booking_changelist"),
                        "badge": "config.dashboard.new_bookings_badge",
                    },
                    {"title": "Mashinalar", "icon": "directions_car", "link": reverse_lazy("admin:cars_car_changelist")},
                ],
            },
            {
                "title": "Mijozlar bilan aloqa",
                "items": [
                    {
                        "title": "Mijoz savollari",
                        "icon": "forum",
                        "link": reverse_lazy("admin:support_question_changelist"),
                        "badge": "config.dashboard.unanswered_questions_badge",
                    },
                    {"title": "FAQ (savol-javob)", "icon": "quiz", "link": reverse_lazy("admin:support_faq_changelist")},
                ],
            },
            {
                "title": "Sozlamalar",
                "items": [
                    {
                        "title": "Adminlar",
                        "icon": "manage_accounts",
                        "link": reverse_lazy("admin:auth_user_changelist"),
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": "Guruhlar",
                        "icon": "group",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
        ],
    },
}
