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
        data = request.data.copy()
        data['created_by'] = request.user.id  # Usando o ID do usuário

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
                'partner_confirmation': data.get('partner_confirmation'),
                'responsible': data.get('responsible'),
                'responsible_sector': data.get('responsible_sector'),
                'status': data.get('status')
            }

            units_data = []
            unit_quantity = int(data.get('unit_quantity', 0))
            for i in range(unit_quantity):
                unit = {
                    'cnpj': data.get(f'units[{i}].cnpj'),
                    'fantasy_name': data.get(f'units[{i}].fantasy_name'),
                    'social_reason': data.get(f'units[{i}].social_reason'),
                    'inep_code': data.get(f'units[{i}].inep_code'),
                    'cep': data.get(f'units[{i}].cep'),
                    'address': data.get(f'units[{i}].address'),
                    'observations': data.get(f'units[{i}].observations'),
                }
                units_data.append(unit)
            
            pricing_ticket_data['units'] = units_data
            
            pricing_ticket_serializer = PricingTicketSerializer(data=pricing_ticket_data)
            if pricing_ticket_serializer.is_valid():
                pricing_ticket_serializer.save()
            else:
                print("Pricing ticket validation errors:", pricing_ticket_serializer.errors)

        attachments = request.FILES.getlist('attachments')
        for attachment in attachments:
            attachment_data = {
                'ticket': demand.id,
                'file': attachment
            }
            attachment_serializer = AttachmentSerializer(data=attachment_data)
            if attachment_serializer.is_valid():
                attachment_serializer.save()
            else:
                print("Attachment validation errors:", attachment_serializer.errors)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def associated_tickets(self, request, pk=None):
        tickets = PricingTicket.objects.filter(ticket=pk)
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