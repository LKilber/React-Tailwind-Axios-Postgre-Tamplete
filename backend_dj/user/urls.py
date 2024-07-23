from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, user_detail

router = DefaultRouter()
router.register(r'users', UserViewSet)  # Register the UserViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('me/', user_detail, name='user-detail'),
]
