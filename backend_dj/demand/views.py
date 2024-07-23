# myapp/views.py
from rest_framework import viewsets
from .models import PricingGroup, PricingTicket, SchoolUnit
from .serializers import PricingGroupSerializer, PricingTicketSerializer, SchoolUnitSerializer

class PricingGroupViewSet(viewsets.ModelViewSet):
    queryset = PricingGroup.objects.all()
    serializer_class = PricingGroupSerializer

class PricingTicketViewSet(viewsets.ModelViewSet):
    queryset = PricingTicket.objects.all()
    serializer_class = PricingTicketSerializer

class SchoolUnitViewSet(viewsets.ModelViewSet):
    queryset = SchoolUnit.objects.all()
    serializer_class = SchoolUnitSerializer
