from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Pricing
from rest_framework import generics
from .models import Pricing
from .serializers import PricingSerializer

@login_required
def download_attachment(request, pk, field_name):
    pricing = get_object_or_404(Pricing, pk=pk)
    if field_name not in ['data_attachment', 'contract_attachment', 'physical_structure_attachment']:
        raise Http404
    attachment = getattr(pricing, field_name)
    if not attachment:
        raise Http404
    return FileResponse(attachment.open(), as_attachment=True)

class PricingCreateView(generics.CreateAPIView):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
