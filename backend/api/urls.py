from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListUsers.as_view(), name='welcome'),

    # Rider 
    path('rider/register/', views.RiderRegister.as_view(), name='rider_register'),
    path('rider/login/', views.RiderLogin.as_view(), name='rider_login'),
    path('rider/profile/<int:pk>', views.RiderProfile.as_view(), name='rider_profile'),
    path('rider/history/<int:pk>', views.RiderHistory.as_view(), name='rider_history'),
    path('rider/favourites/<int:pk>', views.Favourites.as_view(), name='rider_favourites'),

    # Driver
    path('driver/register/', views.DriverRegister.as_view(), name='driver_register'),
    path('driver/login/', views.DriverLogin.as_view(), name='driver_login'),
    path('driver/profile/<int:pk>', views.DriverProfile.as_view(), name='driver_profile'),
    path('driver/history/<int:pk>', views.DriverHistory.as_view(), name='driver_history'),
    path('driver/leaderboards/', views.Leaderboards.as_view(), name='driver_leaderboards'),
    path('driver/demand/', views.Demand.as_view(), name='driver_demand'),
]

 