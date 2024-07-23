# demands/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PricingGroupViewSet, PricingTicketViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'pricing-groups', PricingGroupViewSet)
router.register(r'pricing-tickets', PricingTicketViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('comments/ticket_comments/', CommentViewSet.as_view({'get': 'ticket_comments'}), name='ticket-comments'),
]