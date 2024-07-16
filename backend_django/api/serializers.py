from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['cpf', 'password', 'email', 'sector', 'level', 'name', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            cpf=validated_data['cpf'],
            email=validated_data['email'],
            sector=validated_data['sector'],
            level=validated_data['level'],
            name=validated_data['name'],
            role=validated_data['role'],
            password=validated_data['password'],
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'cpf'

    def validate(self, attrs):
        attrs['username'] = attrs.get(self.username_field)
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['name'] = user.name
        token['cpf'] = user.cpf
        return token