from django.urls import path,re_path
from . import consumers
# type static/chat.html to see the websocket interface
#better use re_path because this is not working currently :
#path('ws/driver/<str:name>', consumers.Driver.as_asgi()), 
websocket_urlpatterns = [
    # re_path(r'^ws/rider(?:/(?P<group_name>\w+))?/?$', consumers.Rider.as_asgi()),
    # path('ws/driver/', consumers.DriverSyncConsumer.as_asgi()),
    path('ws/rider/getDriver', consumers.Rider.as_asgi()), 
    path('ws/driver/getRider', consumers.Driver.as_asgi()),  
]
