from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.shortcuts import get_object_or_404
from . import serializers
from . import models
from .predictor.post_processor import fetch_prediction_data
from .leaders import get_rankings
class ListUsers(APIView):
    def get(self, request, format=None):
        welcome={"Welcome":"To my api framework"}
        return Response(welcome)
    
class RiderRegister(APIView):
    def post(self, request):
        serializer = serializers.RiderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RiderLogin(APIView):
    def post(self,request):
        serializer=serializers.RiderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class RiderProfile(APIView):
    def get(self, request, pk):
        rider = get_object_or_404(models.Rider, pk=pk)
        serializer = serializers.RiderSerializer(rider)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RiderHistory(APIView):
    def get(self,request,pk):
        rider_rides = models.RideDetails.objects.filter(rider=pk)
        serializer=serializers.RideDetailsSerializer(rider_rides,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Favourites(APIView):
    def get(self,request,pk):
        rider_rides = models.RideDetails.objects.filter(rider=pk).filter(favourite=1)
        seen_drivers = set()
        unique_rides = []
        for ride in rider_rides:
            if ride.driver not in seen_drivers:
                seen_drivers.add(ride.driver)
                unique_rides.append(ride)
        serializer = serializers.RideDetailsSerializer(unique_rides, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DriverRegister(APIView):
    def post(self, request):
        print(request)
        serializer = serializers.DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DriverLogin(APIView):
    def post(self,request):
        serializer=serializers.DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class DriverProfile(APIView):
    def get(self, request, pk):
        rider = get_object_or_404(models.Driver, pk=pk)
        serializer = serializers.DriverSerializer(rider)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class DriverHistory(APIView):
    def get(self,request,pk):
        rider_rides = models.RideDetails.objects.filter(driver=pk)
        serializer=serializers.RideDetailsSerializer(rider_rides,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Leaderboards(APIView):
    def get(self, request):
        drivers = models.Driver.objects.all()
        drivers_data = serializers.DriverSerializer(drivers, many=True).data
        if not drivers_data:
            return Response([], status=status.HTTP_200_OK)
        ranked_drivers=get_rankings(drivers_data)
        return Response(ranked_drivers, status=status.HTTP_200_OK)
    
class Demand(APIView):
    def get(self, request, source):
        data=fetch_prediction_data(source)
        return Response(data,status=status.HTTP_200_OK)