from django import forms
from django.contrib import admin, messages
from django.db import transaction
from django.shortcuts import redirect
from django.urls import reverse
from unfold.admin import ModelAdmin
from unfold.contrib.filters.admin import ChoicesDropdownFilter, RangeDateFilter, RelatedDropdownFilter
from unfold.decorators import action, display
from unfold.enums import ActionVariant

from apps.cars.models import Car

from .models import Booking

STATUS_COLORS = {
    Booking.Status.NEW: "warning",
    Booking.Status.CONFIRMED: "success",
    Booking.Status.REJECTED: "danger",
    Booking.Status.RETURNED: "info",
}


def apply_status(booking_id, new_status):
    """Holatni qulf ostida o'zgartiradi (Telegram bot bilan bir xil qoidalar)."""
    with transaction.atomic():
        booking = Booking.objects.select_for_update().select_related("car").get(pk=booking_id)
        Car.objects.select_for_update().get(pk=booking.car_id)
        ok, message = booking.change_status(new_status)
    return booking, ok, message


class BookingAdminForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        start, end, car = cleaned.get("start_date"), cleaned.get("end_date"), cleaned.get("car")
        if start and end and end <= start:
            self.add_error("end_date", "Qaytarish sanasi olish sanasidan keyin bo'lishi kerak.")
        elif car and start and end and cleaned.get("status") == Booking.Status.CONFIRMED:
            probe = Booking(pk=self.instance.pk, car=car, start_date=start, end_date=end, status=self.instance.status if self.instance.pk else Booking.Status.NEW)
            day = probe.capacity_conflict_day()
            if day:
                raise forms.ValidationError(f"{day:%d.%m.%Y} kuni {car.name} ning barcha nusxalari ({car.quantity} ta) band.")
        return cleaned


@admin.register(Booking)
class BookingAdmin(ModelAdmin):
    form = BookingAdminForm
    list_display = ("reference", "customer", "car", "period", "status_label", "created_at")
    list_filter = (
        ("status", ChoicesDropdownFilter),
        ("car", RelatedDropdownFilter),
        ("start_date", RangeDateFilter),
    )
    list_filter_submit = True
    search_fields = ("reference", "customer_name", "phone", "car__name")
    list_select_related = ("car",)
    list_per_page = 30
    date_hierarchy = "start_date"
    readonly_fields = ("reference", "client_ip", "created_at", "updated_at")
    autocomplete_fields = ("car",)
    fieldsets = (
        ("Zayavka", {"fields": (("reference", "status"), "car", ("start_date", "end_date"))}),
        ("Mijoz", {"fields": (("customer_name", "phone"),)}),
        ("Admin uchun", {"fields": ("admin_note", ("created_at", "updated_at"), "client_ip")}),
    )
    actions = ("bulk_confirm", "bulk_reject", "bulk_return")
    actions_detail = ("detail_confirm", "detail_reject", "detail_return")

    # ---------- ro'yxat ustunlari ----------
    @display(description="Mijoz", header=True, ordering="customer_name")
    def customer(self, obj):
        return obj.customer_name, obj.formatted_phone

    @display(description="Sanalar", ordering="start_date")
    def period(self, obj):
        text = f"{obj.start_date:%d.%m} — {obj.end_date:%d.%m.%Y} ({obj.days} kun)"
        return f"{text} · muddati o'tgan!" if obj.is_overdue else text

    @display(description="Holati", ordering="status", label=STATUS_COLORS)
    def status_label(self, obj):
        return obj.status, obj.get_status_display()

    # ---------- umumiy amal ----------
    def _bulk(self, request, queryset, new_status):
        done, failed = 0, []
        for pk in queryset.values_list("pk", flat=True):
            booking, ok, message = apply_status(pk, new_status)
            if ok:
                done += 1
            else:
                failed.append(f"{booking.reference}: {message}")
        if done:
            self.message_user(request, f"{done} ta zayavka yangilandi.", messages.SUCCESS)
        for text in failed:
            self.message_user(request, text, messages.WARNING)

    def _detail(self, request, object_id, new_status):
        booking, ok, message = apply_status(object_id, new_status)
        self.message_user(request, f"{booking.reference}: {message}", messages.SUCCESS if ok else messages.ERROR)
        return redirect(reverse("admin:bookings_booking_change", args=(object_id,)))

    @action(description="✅ Bron qilish", variant=ActionVariant.SUCCESS)
    def bulk_confirm(self, request, queryset):
        self._bulk(request, queryset, Booking.Status.CONFIRMED)

    @action(description="❌ Rad etish", variant=ActionVariant.DANGER)
    def bulk_reject(self, request, queryset):
        self._bulk(request, queryset, Booking.Status.REJECTED)

    @action(description="↩️ Mashina qaytarildi", variant=ActionVariant.INFO)
    def bulk_return(self, request, queryset):
        self._bulk(request, queryset, Booking.Status.RETURNED)

    @action(description="Bron qilish", url_path="confirm", icon="check_circle", variant=ActionVariant.SUCCESS)
    def detail_confirm(self, request, object_id):
        return self._detail(request, object_id, Booking.Status.CONFIRMED)

    @action(description="Rad etish", url_path="reject", icon="cancel", variant=ActionVariant.DANGER)
    def detail_reject(self, request, object_id):
        return self._detail(request, object_id, Booking.Status.REJECTED)

    @action(description="Mashina qaytarildi", url_path="return", icon="assignment_return", variant=ActionVariant.INFO)
    def detail_return(self, request, object_id):
        return self._detail(request, object_id, Booking.Status.RETURNED)
