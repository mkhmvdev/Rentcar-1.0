from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Rent Car boshqaruv paneli"
admin.site.site_title = "Rent Car admin"
admin.site.index_title = "Boshqaruv"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/cars/", include("apps.cars.urls")),
    path("api/bookings/", include("apps.bookings.urls")),
    path("api/", include("apps.support.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
