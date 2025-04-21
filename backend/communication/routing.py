from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/rider/', consumers.Rider.as_asgi()), 
]
