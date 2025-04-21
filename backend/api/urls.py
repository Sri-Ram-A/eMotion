from django.urls import path
from .views import ListUsers

urlpatterns = [
    path('', ListUsers.as_view(), name='list-users'),
]
 