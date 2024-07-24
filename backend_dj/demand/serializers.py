from rest_framework import serializers
from .models import SchoolGroup, Demand, DemandType, Comment, PricingTicket, PricingTicketUnit, Attachment

class DemandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demand
        fields = '__all__'

class DemandTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandType
        fields = '__all__'

class SchoolGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolGroup
        fields = '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class PricingTicketUnitSerializer(serializers.ModelSerializer):
    data_attachments = AttachmentSerializer(many=True, required=False)
    contract_attachment = AttachmentSerializer(many=True, required=False)
    school_structure_attachments = AttachmentSerializer(many=True, required=False)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = PricingTicketUnit
        fields = '__all__'
        extra_kwargs = {
            'pricing_ticket': {'required': False}
        }

    def create(self, validated_data):
        data_attachments_data = validated_data.pop('data_attachments', [])
        contract_attachment_data = validated_data.pop('contract_attachment', [])
        school_structure_attachments_data = validated_data.pop('school_structure_attachments', [])

        unit = PricingTicketUnit.objects.create(**validated_data)

        for attachment_data in data_attachments_data:
            attachment = Attachment.objects.create(**attachment_data)
            unit.data_attachments.add(attachment)

        for attachment_data in contract_attachment_data:
            attachment = Attachment.objects.create(**attachment_data)
            unit.contract_attachment.add(attachment)

        for attachment_data in school_structure_attachments_data:
            attachment = Attachment.objects.create(**attachment_data)
            unit.school_structure_attachments.add(attachment)

        return unit

class PricingTicketSerializer(serializers.ModelSerializer):
    units = PricingTicketUnitSerializer(many=True)

    class Meta:
        model = PricingTicket
        fields = '__all__'
        extra_kwargs = {
            'pricing_type': {'required': True}
        }

    def create(self, validated_data):
        units_data = validated_data.pop('units')
        pricing_ticket = PricingTicket.objects.create(**validated_data)
        for unit_data in units_data:
            unit_data['pricing_ticket'] = pricing_ticket
            PricingTicketUnitSerializer().create(validated_data=unit_data)
        return pricing_ticket
