from django.contrib import admin
from django.db.models import F
from django.utils import timezone
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import ChoicesDropdownFilter
from unfold.decorators import display

from apps.bookings.models import Booking

from .models import Car, CarImage


class CarImageInline(TabularInline):
    model = CarImage
    extra = 0
    fields = ("preview", "image", "sort_order")
    readonly_fields = ("preview",)
    tab = True
    verbose_name_plural = "Qo'shimcha rasmlar"

    @display(description="Ko'rinishi")
    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html('<img src="{}" style="height:56px;border-radius:6px">', obj.image.url)
        return "—"


class UpcomingBookingInline(TabularInline):
    """Mashina sahifasida: hozirgi va kelgusi bronlar (faqat ko'rish uchun)."""

    model = Booking
    extra = 0
    tab = True
    can_delete = False
    show_change_link = True
    verbose_name_plural = "Hozirgi va kelgusi bronlar"
    fields = ("reference", "customer_name", "phone", "start_date", "end_date", "status")
    readonly_fields = fields

    def get_queryset(self, request):
        return (
            super().get_queryset(request)
            .filter(end_date__gte=timezone.localdate(), status__in=(Booking.Status.NEW, Booking.Status.CONFIRMED))
            .order_by("start_date")
        )

    def has_add_permission(self, request, obj=None):
        return False


class AvailabilityFilter(admin.SimpleListFilter):
    title = "Bugungi holati"
    parameter_name = "holati"

    def lookups(self, request, model_admin):
        return (("free", "Bo'sh mashinasi bor"), ("partly", "Qisman ijarada"), ("full", "Hammasi ijarada"))

    def queryset(self, request, queryset):
        if self.value() == "free":
            return queryset.filter(rented_now__lt=F("quantity"))
        if self.value() == "partly":
            return queryset.filter(rented_now__gt=0, rented_now__lt=F("quantity"))
        if self.value() == "full":
            return queryset.filter(rented_now__gte=F("quantity"))
        return queryset


@admin.register(Car)
class CarAdmin(ModelAdmin):
    list_display = ("thumbnail", "title", "car_type", "price", "availability", "is_active")
    list_display_links = ("thumbnail", "title")
    list_editable = ("is_active",)
    list_filter = (AvailabilityFilter, "is_active", ("car_type", ChoicesDropdownFilter), ("transmission", ChoicesDropdownFilter), "brand")
    list_filter_submit = True
    search_fields = ("name", "brand", "color", "plate_number")
    list_per_page = 30
    inlines = (CarImageInline, UpcomingBookingInline)
    save_on_top = True
    warn_unsaved_form = True
    fieldsets = (
        ("Asosiy", {"fields": (("name", "brand"), ("car_type", "year"), ("price_per_day", "quantity"), ("color", "plate_number"))}),
        ("Xususiyatlari", {"fields": (("seats", "transmission", "fuel_type"), "description")}),
        ("Rasm va saytda ko'rinishi", {"fields": ("image", ("is_active", "sort_order"))}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).with_rental_status()

    @display(description="Rasm")
    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:44px;width:72px;object-fit:cover;border-radius:6px">', obj.image.url)
        return format_html('<span class="material-symbols-outlined" style="font-size:32px;opacity:.35">{}</span>', "directions_car")

    @display(description="Mashina", header=True, ordering="name")
    def title(self, obj):
        sub = f"{obj.year} · {obj.plate_number}" if obj.plate_number and obj.quantity == 1 else str(obj.year)
        return obj.name, sub

    @display(description="1 kun", ordering="price_per_day")
    def price(self, obj):
        return f"{obj.price_per_day:,}".replace(",", " ") + " so'm"

    @display(
        description="Bugun",
        ordering="rented_now",
        label={"free": "success", "partly": "warning", "full": "danger"},
    )
    def availability(self, obj):
        free = obj.available_now
        if free == 0:
            until = f" · {obj.next_free_date:%d.%m}gacha" if obj.next_free_date else ""
            return "full", f"Hammasi band{until}"
        if free < obj.quantity:
            return "partly", f"Bo'sh: {free} / {obj.quantity}"
        return "free", f"Bo'sh: {free} / {obj.quantity}"
