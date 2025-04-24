from django.contrib import admin
from .models import Rider, Driver, RideDetails

@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Rider._meta.fields]

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Driver._meta.fields]

@admin.register(RideDetails)
class RideDetailsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in RideDetails._meta.fields]
###This is also correct but using list_display will give you a nice looking table in admin panel 
# admin.site.register(Rider)
# admin.site.register(Driver)
# admin.site.register(RideDetails)