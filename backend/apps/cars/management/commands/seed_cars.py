from django.core.management.base import BaseCommand

from apps.cars.models import Car

DEMO_CARS = [
    dict(name="Chevrolet Cobalt", brand="Chevrolet", car_type="sedan", year=2023, price_per_day=350_000, seats=5,
         transmission="automatic", fuel_type="gas", color="Oq"),
    dict(name="Chevrolet Malibu 2", brand="Chevrolet", car_type="sedan", year=2022, price_per_day=650_000, seats=5,
         transmission="automatic", fuel_type="petrol", color="Qora"),
    dict(name="Chevrolet Tracker", brand="Chevrolet", car_type="suv", year=2024, price_per_day=550_000, seats=5,
         transmission="automatic", fuel_type="petrol", color="Kulrang"),
    dict(name="Kia K5", brand="Kia", car_type="sedan", year=2023, price_per_day=700_000, seats=5,
         transmission="automatic", fuel_type="petrol", color="Oq"),
    dict(name="BYD Song Plus", brand="BYD", car_type="suv", year=2024, price_per_day=800_000, seats=5,
         transmission="automatic", fuel_type="hybrid", color="Ko'k"),
    dict(name="Chevrolet Damas", brand="Chevrolet", car_type="minivan", year=2021, price_per_day=250_000, seats=7,
         transmission="manual", fuel_type="gas", color="Oq"),
]


class Command(BaseCommand):
    help = "Sinov uchun bir nechta mashina qo'shadi (rasmsiz). Mavjud mashinalarga tegmaydi."

    def handle(self, *args, **options):
        created = 0
        for data in DEMO_CARS:
            _, is_new = Car.objects.get_or_create(name=data["name"], year=data["year"], defaults=data)
            created += is_new
        self.stdout.write(self.style.SUCCESS(f"{created} ta yangi mashina qo'shildi."))
