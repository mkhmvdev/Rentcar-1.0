from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Car
from .serializers import CarDetailSerializer, CarListSerializer


class CarListView(generics.ListAPIView):
    """Saytdagi barcha faol mashinalar. Filtrlar: ?type=, ?transmission=, ?seats= (kamida), ?sort=price|-price."""

    serializer_class = CarListSerializer

    def get_queryset(self):
        queryset = Car.objects.active().with_rental_status()
        params = self.request.query_params
        if params.get("type") in Car.CarType.values:
            queryset = queryset.filter(car_type=params["type"])
        if params.get("transmission") in Car.Transmission.values:
            queryset = queryset.filter(transmission=params["transmission"])
        seats = params.get("seats", "")
        if seats.isdigit():
            queryset = queryset.filter(seats__gte=int(seats))
        sort = params.get("sort")
        if sort == "price":
            queryset = queryset.order_by("price_per_day", "id")
        elif sort == "-price":
            queryset = queryset.order_by("-price_per_day", "id")
        return queryset


class CarDetailView(generics.RetrieveAPIView):
    serializer_class = CarDetailSerializer

    def get_queryset(self):
        return Car.objects.active().with_rental_status().prefetch_related("images")


class CarOptionsView(APIView):
    """Frontend filtrlari uchun tanlov ro'yxatlari."""

    def get(self, request):
        def as_list(choices):
            return [{"value": value, "label": label} for value, label in choices]

        return Response({
            "car_types": as_list(Car.CarType.choices),
            "transmissions": as_list(Car.Transmission.choices),
        })
