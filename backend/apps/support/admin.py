from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display

from .models import Faq, Question


@admin.register(Faq)
class FaqAdmin(ModelAdmin):
    list_display = ("question", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    search_fields = ("question", "answer")
    fields = ("question", "answer", ("sort_order", "is_active"))


@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ("sender", "short_message", "answered", "created_at")
    list_filter = ("is_answered",)
    search_fields = ("full_name", "phone", "message")
    readonly_fields = ("full_name", "phone", "message", "client_ip", "created_at")
    fieldsets = (
        ("Mijoz", {"fields": (("full_name", "phone"), "created_at")}),
        ("Savol", {"fields": ("message",)}),
        ("Admin uchun", {"fields": ("is_answered", "admin_note", "client_ip")}),
    )
    actions = ("mark_answered",)

    def has_add_permission(self, request):
        return False

    @display(description="Mijoz", header=True, ordering="full_name")
    def sender(self, obj):
        return obj.full_name, obj.formatted_phone

    @display(description="Savol")
    def short_message(self, obj):
        return obj.message if len(obj.message) <= 80 else obj.message[:80] + "…"

    @display(description="Holati", label={True: "success", False: "warning"}, ordering="is_answered")
    def answered(self, obj):
        return obj.is_answered, "Javob berildi" if obj.is_answered else "Javob kutmoqda"

    @admin.action(description="Javob berildi deb belgilash")
    def mark_answered(self, request, queryset):
        updated = queryset.update(is_answered=True)
        self.message_user(request, f"{updated} ta savol belgilandi.")
