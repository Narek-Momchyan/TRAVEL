from django.db import models
from django.contrib.auth.models import AbstractUser


class Customer(AbstractUser):
    email = models.EmailField(unique=True, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    
    
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    def __str__(self):
        return self.username
        
    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'


class OTPVerification(models.Model):
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    
