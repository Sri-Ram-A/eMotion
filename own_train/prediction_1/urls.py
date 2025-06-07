from django.urls import path
from . import views

urlpatterns = [
    path('', views.input_page, name='input_page'),
    path('get_data/', views.fetch_prediction_data, name='fetch_prediction_data'),
]
