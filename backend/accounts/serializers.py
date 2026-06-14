from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Customer

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        validate_password(value) 
        return value

    def validate(self, data):
        if not data.get('email'):
            raise serializers.ValidationError({"error": "Անհրաժեշտ է տրամադրել էլ. փոստ:"})
        return data

    def create(self, validated_data):
        user = Customer.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            is_active=False
        )
        return user


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp_code = serializers.CharField(max_length=6, required=True)

    def validate(self, data):
        if not data.get('email'):
            raise serializers.ValidationError({"error": "Անհրաժեշտ է տրամադրել էլ. փոստ:"})
        return data


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['country', 'city', 'street', 'postal_code']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username', 'email', 'first_name', 'last_name', 'avatar', 'country', 'city', 'street', 'postal_code', 'is_email_verified']