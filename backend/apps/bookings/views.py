import ipaddress

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import BookingCreatedSerializer, BookingCreateSerializer
from .telegram import notify_new_booking


class BookingCreateView(APIView):
    """Mijoz zayavkasi. Narx hisoblanmaydi: admin mijozga qo'ng'iroq qilib kelishadi."""

    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "bookings"

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            booking = serializer.save(client_ip=self._client_ip(request))
            transaction.on_commit(lambda: notify_new_booking(booking.pk))
        return Response(BookingCreatedSerializer(booking).data, status=status.HTTP_201_CREATED)

    def _client_ip(self, request):
        # DRF throttling bilan bir xil usulda aniqlanadi (NUM_PROXIES sozlamasi).
        ident = ScopedRateThrottle().get_ident(request)
        try:
            return str(ipaddress.ip_address(ident))
        except ValueError:
            return None
