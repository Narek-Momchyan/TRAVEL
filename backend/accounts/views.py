import random
import requests 
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.contrib.auth import authenticate
from .models import Customer, OTPVerification
from .serializers import RegisterSerializer, OTPVerifySerializer, LoginSerializer, AddressSerializer, ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import threading

def send_otp_email(user, otp_code):
    try:
        if user.email:
            send_mail(
                subject='Confirm your registration',
                message=f'Hello {user.username},\n\nYour verification code is: {otp_code}\nThe code is valid for 5 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False, 
            )
    except Exception as e:
        print(f"Failed to send email to {user.email}: {e}")
        # Delete user if email fails so they can try again
        user.delete()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            otp_code = str(random.randint(100000, 999999))
            OTPVerification.objects.filter(user=user).delete()
            OTPVerification.objects.create(user=user, otp_code=otp_code)
            
            # Send email in background to prevent blocking and make request faster
            threading.Thread(target=send_otp_email, args=(user, otp_code)).start()

            return Response(
                {"message": "Code sent successfully. Please confirm."}, 
                status=status.HTTP_201_CREATED
            )
            
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data.get('email')
        otp_code = serializer.validated_data.get('otp_code')
        
        try:
            user = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
        try:
            otp_record = OTPVerification.objects.get(user=user, otp_code=otp_code)
            
            expiration_time = otp_record.created_at + timedelta(minutes=5)
            if timezone.now() > expiration_time:
                otp_record.delete()
                return Response({"error": "Code has expired."}, status=status.HTTP_400_BAD_REQUEST)
                
            user.is_active = True
            user.is_email_verified = True
            user.save()
            otp_record.delete()
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Confirmation successful.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        login_identifier = serializer.validated_data['login']
        password = serializer.validated_data['password']
        
        user = None
        try:
            user_obj = Customer.objects.filter(
                Q(username=login_identifier) | 
                Q(email=login_identifier)
            ).first()
            
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)
        except Exception:
            pass
            
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
        if user and not user.is_active:
            return Response({"error": "User is not verified."}, status=status.HTTP_401_UNAUTHORIZED)
            
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


class AddressView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        serializer = AddressSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Address saved.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
