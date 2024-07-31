from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth.hashers import make_password
from rest_framework import status

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=user)

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'sector': profile.sector,
        'role': profile.role,
        'level': profile.level
    }
    return Response(user_data)

@permission_classes([IsAuthenticated])
class CreateUserViewSet(viewsets.ViewSet):
    def create(self, request):
        data = request.data
        print("Received data:", data)  # Debug print

        try:
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password'])
            )
            Profile.objects.update_or_create(
                user=user,
                defaults={
                    'sector': data.get('sector', ''),
                    'role': data.get('role', ''),
                    'level': data.get('level', '')
                }
            )
            print("User created successfully")  # Debug print
            return Response({'id': user.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error:", str(e))  # Debug print
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)