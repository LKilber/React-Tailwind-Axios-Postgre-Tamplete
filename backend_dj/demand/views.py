from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import SchoolGroup, PricingTicket, Comment, Demand, DemandType
from .serializers import DemandSerializer, DemandTypeSerializer, AttachmentSerializer, SchoolGroupSerializer, PricingTicketSerializer, CommentSerializer

class DemandViewSet(viewsets.ModelViewSet):
    queryset = Demand.objects.all()
    serializer_class = DemandSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        data['created_by'] = request.user.username  # Preenche o campo created_by
        serializer = self.get_serializer(data=data)

        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        demand = serializer.save()
        
        # Verifica se o tipo de demanda é Precificação e cria o ticket de precificação
        if demand.demand_type.name == 'Precificação':
            pricing_ticket_data = {
                'ticket': demand.id,
                'group': data.get('group'),
                'selected_group': data.get('selected_group'),
                'unit_quantity': data.get('unit_quantity'),
                'pricing_type': data.get('pricing_type'),
                'commercial_partners': data.get('commercial_partners'),
                'responsible': data.get('responsible'),
                'responsible_sector': data.get('responsible_sector'),
                'status': data.get('status')
            }

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
                    'history_profile': data.get(f'units[{i}].history_profile')
                }
                units_data.append(unit)
            
            pricing_ticket_data['units'] = units_data
            
            pricing_ticket_serializer = PricingTicketSerializer(data=pricing_ticket_data)
            if pricing_ticket_serializer.is_valid():
                pricing_ticket_serializer.save()

                attachments_data = data.get(f'units[{i}].attachments', [])
                for attachment_data in attachments_data:
                    attachment_data['unit'] = unit.id
                    attachment_data['ticket'] = demand.id
                    attachment_serializer = AttachmentSerializer(data=attachment_data)
                    if attachment_serializer.is_valid():
                        attachment_serializer.save()
                    else:
                        print("Validation errors in Attachment:", attachment_serializer.errors)
                        return Response(attachment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("Validation errors in PricingTicket:", pricing_ticket_serializer.errors)
                return Response(pricing_ticket_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def associated_tickets(self, request, pk=None):
        tickets = PricingTicket.objects.filter(ticket=pk)
        print(tickets)
        serializer = PricingTicketSerializer(tickets, many=True)
        return Response(serializer.data)

class SchoolGroupViewSet(viewsets.ModelViewSet):
    queryset = SchoolGroup.objects.all()
    serializer_class = SchoolGroupSerializer

class DemandTypeViewSet(viewsets.ModelViewSet):
    queryset = DemandType.objects.all()
    serializer_class = DemandTypeSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    @action(detail=False, methods=['get'])
    def ticket_comments(self, request):
        ticket_id = request.query_params.get('ticket_id')
        comments = Comment.objects.filter(ticket_id=ticket_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        data['user'] = request.user.username
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(data)
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)