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
    rented_until = serializers.DateField(read_only=True)

    class Meta:
        model = Car
        fields = (
            "id", "name", "brand", "car_type", "car_type_label", "year", "price_per_day",
            "seats", "transmission", "transmission_label", "fuel_type", "fuel_type_label",
            "image", "rented_until",
        )

    def get_image(self, obj):
        return media_url(obj.image)


class CarDetailSerializer(CarListSerializer):
    images = serializers.SerializerMethodField()

    class Meta(CarListSerializer.Meta):
        fields = CarListSerializer.Meta.fields + ("color", "description", "images")

    def get_images(self, obj):
        return [media_url(item.image) for item in obj.images.all()]
