import logging
import time

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.bookings.telegram import TelegramError, get_updates, handle_callback

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Telegram botdagi tugma bosishlarini (long polling) qabul qiladi."

    def handle(self, *args, **options):
        if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_ID:
            raise CommandError("TELEGRAM_BOT_TOKEN va TELEGRAM_ADMIN_ID .env faylida sozlanishi kerak.")

        self.stdout.write(self.style.SUCCESS("Telegram bot ishga tushdi. To'xtatish: Ctrl+C"))
        offset = 0
        while True:
            try:
                for update in get_updates(offset):
                    offset = update["update_id"] + 1
                    callback = update.get("callback_query")
                    if callback:
                        try:
                            handle_callback(callback)
                        except TelegramError:
                            logger.exception("Tugma bosilishini qayta ishlab bo'lmadi")
            except TelegramError:
                logger.exception("Telegram bilan aloqa xatosi, 3 soniyadan keyin qayta urinamiz")
                time.sleep(3)
