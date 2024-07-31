from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, user_detail, CreateUserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'create-user', CreateUserViewSet, basename='create-user')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', user_detail, name='user-detail'),
]
