from django.contrib import admin
from django.utils.html import format_html

from .models import Car, CarImage


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ("image", "preview", "sort_order")
    readonly_fields = ("preview",)

    @admin.display(description="Ko'rinishi")
    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:6px">', obj.image.url)
        return "—"


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "name", "year", "car_type", "price_per_day", "rental_status", "is_active", "sort_order")
    list_display_links = ("thumbnail", "name")
    list_editable = ("is_active", "sort_order")
    list_filter = ("is_active", "car_type", "transmission", "fuel_type", "brand")
    search_fields = ("name", "brand", "color")
    inlines = (CarImageInline,)
    fieldsets = (
        (None, {"fields": ("name", "brand", "car_type", "year", "color", "price_per_day")}),
        ("Xususiyatlar", {"fields": ("seats", "transmission", "fuel_type", "description")}),
        ("Rasm va ko'rinish", {"fields": ("image", "is_active", "sort_order")}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).with_rental_status()

    @admin.display(description="Rasm")
    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:44px;width:70px;object-fit:cover;border-radius:6px">', obj.image.url)
        return "—"

    @admin.display(description="Holati", ordering="rented_until")
    def rental_status(self, obj):
        if obj.rented_until:
            return format_html('<b style="color:#b45309">Ijarada · {} gacha</b>', obj.rented_until.strftime("%d.%m.%Y"))
        return format_html('<span style="color:#047857">{}</span>', "Bo'sh")
