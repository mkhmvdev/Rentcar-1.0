from django.urls import path

from .views import BookingCreateView, BookingStatusView

urlpatterns = [
    path("", BookingCreateView.as_view(), name="booking-create"),
    path("<str:reference>/", BookingStatusView.as_view(), name="booking-status"),
]
