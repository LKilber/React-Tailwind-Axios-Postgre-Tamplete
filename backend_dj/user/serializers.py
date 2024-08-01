from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['sector', 'role', 'level']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)  # Make profile optional

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'first_name', 'last_name', 'is_active']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)  # Safely pop profile data

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile fields only if provided
        if profile_data:
            profile, created = Profile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance