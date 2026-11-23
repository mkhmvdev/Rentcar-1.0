import logging
import time

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import OperationalError

from apps.bookings.telegram import TelegramError, get_updates, handle_callback, prepare_polling

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Telegram botdagi tugma bosishlarini (long polling) qabul qiladi."

    def handle(self, *args, **options):
        if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_ID:
            raise CommandError("TELEGRAM_BOT_TOKEN va TELEGRAM_ADMIN_ID .env faylida sozlanishi kerak.")

        try:
            username = prepare_polling()
        except TelegramError as exc:
            raise CommandError(f"Telegram botga ulanib bo'lmadi (token to'g'rimi?): {exc}") from exc
        self.stdout.write(self.style.SUCCESS(f"Telegram bot @{username} ishga tushdi. To'xtatish: Ctrl+C"))
        offset = 0
        while True:
            try:
                for update in get_updates(offset):
                    callback = update.get("callback_query")
                    try:
                        if callback:
                            handle_callback(callback)
                    except (OperationalError, TelegramError):
                        logger.exception("Tugma bosilishini qayta ishlab bo'lmadi; qayta uriniladi")
                        time.sleep(3)
                        break
                    offset = update["update_id"] + 1
            except TelegramError:
                logger.exception("Telegram bilan aloqa xatosi, 3 soniyadan keyin qayta urinamiz")
                time.sleep(3)
