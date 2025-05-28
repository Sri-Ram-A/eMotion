from django.db import models


# Create your models here.
class Rider(models.Model):
    name = models.CharField(max_length=50)
    email=models.EmailField(max_length=254)
    phone_number=models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.name}"

class Driver(models.Model):
    name = models.CharField(max_length=50)
    email=models.EmailField(max_length=254)
    phone_number=models.CharField(max_length=10)
    vehicle_year=models.CharField(max_length=4)
    vehicle_plate=models.CharField(max_length=10)
    driving_license=models.CharField(max_length=15)
    rating=models.CharField(max_length=1,default=0)
    earnings=models.CharField(default=0)
    available=models.CharField(default="1")

    def __str__(self):
        return f"{self.name}"

class RideDetails(models.Model):
    rider=models.ForeignKey(Rider,on_delete=models.CASCADE)
    driver=models.ForeignKey(Driver,on_delete=models.CASCADE)
    source=models.CharField(max_length=50)
    destination=models.CharField(max_length=50)
    pickup_time=models.DateTimeField(auto_now_add=True)
    estimated_duration = models.CharField(max_length=3)
    distance = models.CharField(max_length=3)
    price=models.CharField(max_length=4)
    payment_methods=[
        ("cash","rider paid driver by cash"),
        ("card","rider paid driver by card")
    ]
    payment_mode=models.CharField(choices=payment_methods)
    ride_rating=models.CharField(1,default=2)
    review_cleanliness=models.BooleanField(default=False)
    review_discipline=models.BooleanField(default=False)
    review_friendly=models.BooleanField(default=False)
    review_safety=models.BooleanField(default=False)
    review_arrive_on_time=models.BooleanField(default=False)
    status=models.BooleanField(default=1,
        help_text="1:ongoing , 0:ride ended"
    )
    favourite=models.BooleanField(default=False)
    def __str__(self):
        return f"{self.rider} to {self.destination} on {self.pickup_time.strftime('%Y-%m-%d %H:%M')}"
    





