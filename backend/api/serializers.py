from rest_framework import serializers
from . import models
from pprint import pprint
class RiderSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Rider
		fields = "__all__"

class RideDetailsSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.RideDetails
		fields = "__all__"

class DriverSerializer(serializers.ModelSerializer):
	class Meta:
		model=models.Driver
		fields='__all__'

