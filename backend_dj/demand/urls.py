# /demand/urls.py

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import download_attachment, PricingCreateView

urlpatterns = [
    path('download/<int:pk>/<str:field_name>/', download_attachment, name='download_attachment'),
    path('api/pricing/', PricingCreateView.as_view(), name='pricing-create'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
