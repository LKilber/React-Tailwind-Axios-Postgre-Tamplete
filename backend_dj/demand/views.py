from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import PricingGroup, PricingTicket, Comment
from .serializers import PricingGroupSerializer, PricingTicketSerializer, CommentSerializer

class PricingGroupViewSet(viewsets.ModelViewSet):
    queryset = PricingGroup.objects.all()
    serializer_class = PricingGroupSerializer

class PricingTicketViewSet(viewsets.ModelViewSet):
    queryset = PricingTicket.objects.all()
    serializer_class = PricingTicketSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        # Process the units data
        units_data = []
        for i in range(int(data.get('unit_quantity', 0))):
            unit = {
                'cnpj': data.get(f'units[{i}].cnpj'),
                'fantasy_name': data.get(f'units[{i}].fantasy_name'),
                'social_reason': data.get(f'units[{i}].social_reason'),
                'inep_code': data.get(f'units[{i}].inep_code'),
                'cep': data.get(f'units[{i}].cep'),
                'address': data.get(f'units[{i}].address'),
                'observations': data.get(f'units[{i}].observations'),
                'history_description': data.get(f'units[{i}].history_description'),
                'commercial_partners': data.get(f'units[{i}].commercial_partners') == 'yes',
                'partner_details': data.get(f'units[{i}].partner_details'),
                'history_profile': data.get(f'units[{i}].history_profile'),
                'data_attachments': [
                    {'file': request.FILES.get(f'units[{i}].data_attachments[0]')}
                ],
                'contract_attachment': [
                    {'file': request.FILES.get(f'units[{i}].contract_attachment[0]')}
                ],
                'school_structure_attachments': [
                    {'file': request.FILES.get(f'units[{i}].school_structure_attachments[0]')}
                ]
            }
            units_data.append(unit)

        # Transform the data into the expected format
        transformed_data = {
            'group': data.get('group'),
            'selected_group': data.get('selected_group'),
            'unit_quantity': data.get('unit_quantity'),
            'pricing_type': data.get('pricing_type'),
            'units': units_data
        }

        serializer = self.get_serializer(data=transformed_data)
        if not serializer.is_valid():
            # Print validation errors
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    @action(detail=False, methods=['get'])
    def ticket_comments(self, request):
        ticket_id = request.query_params.get('ticket_id')
        comments = Comment.objects.filter(pricing_ticket_id=ticket_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)