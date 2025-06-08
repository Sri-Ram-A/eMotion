from django.db.models.signals import post_save
from django.dispatch import receiver
from . import models
@receiver(post_save, sender=models.RideDetails)
def update_driver_stats(sender, instance, created, **kwargs):
    if created:  # Only on new ride
        driver = instance.driver
        driver.earnings += float(instance.price) # Update earnings
        driver.total_rides += 1 # Update total rides and total rating
        driver.total_rating += int(instance.ride_rating)
        driver.rating = round(driver.total_rating / driver.total_rides, 2) # Calculate average rating
        driver.save()
