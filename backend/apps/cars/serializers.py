from rest_framework import serializers

from .models import Car


def media_url(field):
    # Nisbiy yo'l qaytariladi (/media/...): frontend uni o'z domeni orqali backendga yo'naltiradi.
    return field.url if field else None


class CarListSerializer(serializers.ModelSerializer):
    car_type_label = serializers.CharField(source="get_car_type_display", read_only=True)
    transmission_label = serializers.CharField(source="get_transmission_display", read_only=True)
    fuel_type_label = serializers.CharField(source="get_fuel_type_display", read_only=True)
    image = serializers.SerializerMethodField()
    plate_number = serializers.SerializerMethodField()
    available_count = serializers.IntegerField(source="available_now", read_only=True)
    next_free_date = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = (
            "id", "name", "brand", "car_type", "car_type_label", "year", "price_per_day",
            "seats", "transmission", "transmission_label", "fuel_type", "fuel_type_label",
            "image", "plate_number", "quantity", "available_count", "next_free_date",
        )

    def get_image(self, obj):
        return media_url(obj.image)

    def get_plate_number(self, obj):
        # Bir nechta nusxa bo'lsa, bitta raqam ko'rsatish chalg'itadi.
        return obj.plate_number if obj.quantity == 1 else ""

    def get_next_free_date(self, obj):
        """Barcha nusxalar band bo'lsa — birinchi qaytadigan mashinaning sanasi."""
        if obj.available_now > 0:
            return None
        date = getattr(obj, "next_free_date", None)
        return str(date) if date else None


class CarDetailSerializer(CarListSerializer):
    images = serializers.SerializerMethodField()
    busy_ranges = serializers.SerializerMethodField()

    class Meta(CarListSerializer.Meta):
        fields = CarListSerializer.Meta.fields + ("color", "description", "images", "busy_ranges")

    def get_images(self, obj):
        return [media_url(item.image) for item in obj.images.all()]

    def get_busy_ranges(self, obj):
        return [{"start": str(r["start_date"]), "end": str(r["end_date"])} for r in obj.busy_ranges()]
