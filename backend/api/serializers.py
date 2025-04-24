from rest_framework import serializers
from . import models
from pprint import pprint
class RiderRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Rider
		fields = "__all__"
		
class RiderLoginSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Rider
		fields = ['phone_number']
		
class RiderProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Rider
		fields = "__all__"

class RiderHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = models.RideDetails
		fields = "__all__"

class RiderFavouriteSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.RideDetails
		fields = "__all__"
		
class DriverRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model=models.Driver
		fields='__all__'

class DriverLoginSerializer(serializers.ModelSerializer):
	class Meta:
		model=models.Driver
		fields=['phone_number']

class DriverProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model=models.Driver
		fields='__all__'

class DriverHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = models.RideDetails
		fields = "__all__"
		
