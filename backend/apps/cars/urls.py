from django.urls import path

from .views import CarDetailView, CarListView, CarOptionsView

urlpatterns = [
    path("", CarListView.as_view(), name="car-list"),
    path("options/", CarOptionsView.as_view(), name="car-options"),
    path("<int:pk>/", CarDetailView.as_view(), name="car-detail"),
]
