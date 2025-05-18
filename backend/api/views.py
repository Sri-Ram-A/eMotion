from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework import generics
from . import serializers
from . import models

class ListUsers(APIView):
    def get(self, request, format=None):
        welcome={"Welcome":"To my api framework"}
        return Response(welcome)
    
class RiderRegister(APIView):
    def post(self, request):
        serializer = serializers.RiderRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RiderLogin(APIView):
    def post(self,request):
        serializer=serializers.RiderLoginSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class RiderProfile(APIView):
    def get(self, request, pk):
        rider = get_object_or_404(models.Rider, pk=pk)
        serializer = serializers.RiderProfileSerializer(rider)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RiderHistory(APIView):
    def get(self,request,pk):
        print(f"Received pk: {pk}") 
        print(f"datatype pk: {type(pk)}") 
        rider_rides = models.RideDetails.objects.filter(rider=pk)
        for ride in rider_rides:
            print(ride.__dict__)
        serializer=serializers.RiderHistorySerializer(rider_rides,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Favourites(APIView):
    def get(self,request,pk):
        rider_rides = models.RideDetails.objects.filter(rider=pk).filter(favourite=1)
        serializer=serializers.RiderFavouriteSerializer(rider_rides,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DriverRegister(APIView):
    def post(self, request):
        print(request)
        serializer = serializers.DriverRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DriverLogin(APIView):
    def post(self,request):
        serializer=serializers.DriverLoginSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class DriverProfile(APIView):
    def get(self, request, pk):
        rider = get_object_or_404(models.Driver, pk=pk)
        serializer = serializers.DriverProfileSerializer(rider)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DriverHistory(APIView):
    def get(self,request,pk):
        rider_rides = models.RideDetails.objects.filter(driver=pk)
        serializer=serializers.DriverHistorySerializer(rider_rides,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Leaderboards(APIView):
    pass
class Demand(APIView):
    pass