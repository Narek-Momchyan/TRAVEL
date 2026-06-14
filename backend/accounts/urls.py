from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, AddressView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/address/', AddressView.as_view(), name='address'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
