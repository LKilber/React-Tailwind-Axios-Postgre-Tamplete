# api/urls.py

from django.urls import path
from .views import register
from .views import MyTokenObtainPairView

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
