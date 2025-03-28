from django.urls import path
from . import views

urlpatterns = [
    path('check-suspicious-upi', views.check_upi, name='check_upi'),
]
