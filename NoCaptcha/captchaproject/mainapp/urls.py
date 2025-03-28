from django.urls import path
from . import views

urlpatterns = [
    path('store-interaction-data/', views.store_interaction_data, name='store_interaction_data'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
]