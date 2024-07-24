# demands/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SchoolGroupViewSet, CommentViewSet, DemandViewSet, DemandTypeViewSet

router = DefaultRouter()
router.register(r'demands', DemandViewSet)
router.register(r'demand-types', DemandTypeViewSet)
router.register(r'pricing-groups', SchoolGroupViewSet)
router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('comments/ticket_comments/', CommentViewSet.as_view({'get': 'ticket_comments'}), name='ticket-comments'),
]