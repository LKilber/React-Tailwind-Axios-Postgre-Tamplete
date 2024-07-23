# demands/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PricingGroupViewSet, PricingTicketViewSet, SchoolUnitViewSet

router = DefaultRouter()
router.register(r'pricing-groups', PricingGroupViewSet)
router.register(r'pricing-tickets', PricingTicketViewSet)
router.register(r'school-units', SchoolUnitViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
