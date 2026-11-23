"""Telegram bot: yangi zayavkani adminga yuborish va tugmalar orqali holatni o'zgartirish.

Xabarlar oddiy matn sifatida yuboriladi (parse_mode yo'q), shuning uchun mijoz kiritgan
matn Telegram formatlashini buza olmaydi.
"""

import logging
import re

import requests
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.cars.models import Car

from .models import Booking

logger = logging.getLogger(__name__)
API_URL = "https://api.telegram.org/bot{token}/{method}"

STATUS_ICONS = {
    Booking.Status.NEW: "🆕",
    Booking.Status.CONFIRMED: "✅",
    Booking.Status.REJECTED: "❌",
    Booking.Status.RETURNED: "↩️",
}

# Callback nomi -> yangi holat
ACTIONS = {
    "confirm": Booking.Status.CONFIRMED,
    "reject": Booking.Status.REJECTED,
    "return": Booking.Status.RETURNED,
}


class TelegramError(RuntimeError):
    pass


def call_api(method, payload, timeout=15):
    token = settings.TELEGRAM_BOT_TOKEN
    if not token:
        raise TelegramError("TELEGRAM_BOT_TOKEN sozlanmagan")
    try:
        response = requests.post(API_URL.format(token=token, method=method), json=payload, timeout=timeout)
        result = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise TelegramError(f"Telegram {method} so'rovi bajarilmadi: {exc}") from exc
    if not result.get("ok"):
        raise TelegramError(f"Telegram {method} rad etdi: {result.get('description', 'nomalum xato')}")
    return result.get("result")


def format_money(amount):
    return f"{amount:,}".replace(",", " ") + " so'm"


STATUS_FOOTERS = {
    Booking.Status.CONFIRMED: "✅ Bron qilindi",
    Booking.Status.REJECTED: "❌ Rad etildi",
    Booking.Status.RETURNED: "↩️ Mashina qaytarildi",
}


def booking_text(booking):
    icon = STATUS_ICONS.get(booking.status, "")
    lines = [
        f"{icon} {booking.get_status_display()}",
        f"🔖 Zayavka raqami: {booking.reference}",
        "",
        f"🚗 {booking.car.name} ({booking.car.year})",
        f"👤 {booking.customer_name}",
        f"📞 {booking.formatted_phone}",
        f"📅 {booking.start_date:%d.%m.%Y} — {booking.end_date:%d.%m.%Y} ({booking.days} kun)",
        f"💰 Saytdagi narx: {format_money(booking.car.price_per_day)} / kun",
    ]
    footer = STATUS_FOOTERS.get(booking.status)
    if footer and booking.updated_at:
        changed_at = timezone.localtime(booking.updated_at)
        lines += ["", f"{footer}: {changed_at:%d.%m.%Y %H:%M}", f"🔖 {booking.reference}"]
    return "\n".join(lines)


def booking_keyboard(booking):
    if booking.status == Booking.Status.NEW:
        buttons = [
            {"text": "✅ Bron qilish", "callback_data": f"confirm:{booking.pk}"},
            {"text": "❌ Rad etish", "callback_data": f"reject:{booking.pk}"},
        ]
    elif booking.status == Booking.Status.CONFIRMED:
        buttons = [{"text": "↩️ Mashina qaytarildi", "callback_data": f"return:{booking.pk}"}]
    else:
        buttons = []
    return {"inline_keyboard": [buttons] if buttons else []}


def notify_new_booking(booking_id):
    """Yangi zayavkani adminga yuboradi. Xato bo'lsa faqat logga yoziladi — mijoz zayavkasi baribir saqlangan."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_ID:
        logger.warning("Zayavka #%s Telegramga yuborilmadi: bot sozlanmagan", booking_id)
        return
    try:
        booking = Booking.objects.select_related("car").get(pk=booking_id)
        call_api("sendMessage", {
            "chat_id": settings.TELEGRAM_ADMIN_ID,
            "text": booking_text(booking),
            "reply_markup": booking_keyboard(booking),
        })
    except (Booking.DoesNotExist, TelegramError):
        logger.exception("Zayavka #%s Telegramga yuborilmadi", booking_id)


def answer_callback(callback_id, text, show_alert=False):
    """Tugma ustida qisqa javob ko'rsatadi. Bu faqat bezak: Telegram ~15 daqiqadan eski bosishga javob
    qabul qilmaydi, shuning uchun xato bo'lsa logga yozamiz va asosiy ishni (holatni o'zgartirish) to'xtatmaymiz."""
    try:
        call_api("answerCallbackQuery", {"callback_query_id": callback_id, "text": text, "show_alert": show_alert})
    except TelegramError:
        logger.warning("Tugma bosilishiga javob berib bo'lmadi (eskirgan bo'lishi mumkin)", exc_info=True)


def update_message(callback_query, booking):
    message = callback_query.get("message") or {}
    chat_id = (message.get("chat") or {}).get("id")
    if not chat_id or not message.get("message_id"):
        return
    call_api("editMessageText", {
        "chat_id": chat_id,
        "message_id": message["message_id"],
        "text": booking_text(booking),
        "reply_markup": booking_keyboard(booking),
    })


def handle_callback(callback_query):
    callback_id = callback_query.get("id")
    actor_id = str((callback_query.get("from") or {}).get("id", ""))
    if not settings.TELEGRAM_ADMIN_ID or actor_id != str(settings.TELEGRAM_ADMIN_ID):
        answer_callback(callback_id, "Sizga ruxsat berilmagan.", show_alert=True)
        return

    match = re.fullmatch(r"(confirm|reject|return):(\d+)", callback_query.get("data") or "")
    if not match:
        answer_callback(callback_id, "Noto'g'ri amal.", show_alert=True)
        return

    action, booking_id = match.groups()
    new_status = ACTIONS[action]
    with transaction.atomic():
        booking = Booking.objects.select_for_update().select_related("car").filter(pk=booking_id).first()
        if booking is None:
            answer_callback(callback_id, "Zayavka topilmadi.", show_alert=True)
            return
        # Bir vaqtda ikki bron tasdiqlanib, mashinalar sonidan oshib ketmasligi uchun mashinani ham qulflaymiz.
        Car.objects.select_for_update().get(pk=booking.car_id)
        changed, message = booking.change_status(new_status)

    if changed:
        answer_callback(callback_id, f"{STATUS_ICONS[new_status]} {message}")
    else:
        answer_callback(callback_id, message, show_alert=True)
    # Xabarni har doim joriy holatga moslaymiz (masalan, admin panelda o'zgartirilgan bo'lsa).
    try:
        update_message(callback_query, booking)
    except TelegramError:
        logger.exception("Zayavka %s xabarini yangilab bo'lmadi", booking.reference)


def prepare_polling():
    """Tokenni tekshiradi va webhook o'rnatilgan bo'lsa o'chiradi (aks holda getUpdates ishlamaydi).
    Navbatdagi tugma bosishlari saqlanib qoladi. Bot nomini qaytaradi."""
    me = call_api("getMe", {})
    call_api("deleteWebhook", {"drop_pending_updates": False})
    return me.get("username", "")


def get_updates(offset, timeout=30):
    return call_api(
        "getUpdates",
        {"offset": offset, "timeout": timeout, "allowed_updates": ["callback_query"]},
        timeout=timeout + 10,
    ) or []
