from django.contrib import admin, messages

from .models import Booking


def _status_action(new_status, description):
    @admin.action(description=description)
    def action(modeladmin, request, queryset):
        changed = skipped = 0
        for booking in queryset:
            if booking.can_change_to(new_status):
                booking.status = new_status
                booking.save(update_fields=("status", "updated_at"))
                changed += 1
            else:
                skipped += 1
        if changed:
            modeladmin.message_user(request, f"{changed} ta zayavka yangilandi.", messages.SUCCESS)
        if skipped:
            modeladmin.message_user(request, f"{skipped} ta zayavkaning holatini bunday o'zgartirib bo'lmaydi.", messages.WARNING)

    action.__name__ = f"mark_{new_status}"
    return action


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("reference", "created_at", "customer_name", "formatted_phone", "car", "start_date", "end_date", "status")
    list_filter = ("status", "start_date", "car")
    search_fields = ("reference", "customer_name", "phone", "car__name")
    date_hierarchy = "start_date"
    list_select_related = ("car",)
    readonly_fields = ("reference", "client_ip", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("reference", "status", "car")}),
        ("Mijoz", {"fields": ("customer_name", "phone")}),
        ("Sanalar", {"fields": ("start_date", "end_date")}),
        ("Admin uchun", {"fields": ("admin_note", "client_ip", "created_at", "updated_at")}),
    )
    actions = (
        _status_action(Booking.Status.CONFIRMED, "✅ Bron qilish"),
        _status_action(Booking.Status.REJECTED, "❌ Rad etish"),
        _status_action(Booking.Status.RETURNED, "↩️ Mashina qaytarildi"),
    )

    @admin.display(description="Telefon", ordering="phone")
    def formatted_phone(self, obj):
        return obj.formatted_phone
