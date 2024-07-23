# myapp/serializers.py
from rest_framework import serializers
from .models import PricingGroup, PricingTicket, SchoolUnit

class PricingGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingGroup
        fields = '__all__'

class SchoolUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolUnit
        fields = '__all__'

class PricingTicketSerializer(serializers.ModelSerializer):
    units = SchoolUnitSerializer(many=True)

    class Meta:
        model = PricingTicket
        fields = '__all__'

    def create(self, validated_data):
        units_data = validated_data.pop('units')
        pricing_ticket = PricingTicket.objects.create(**validated_data)
        for unit_data in units_data:
            SchoolUnit.objects.create(pricing_ticket=pricing_ticket, **unit_data)
        return pricing_ticket
