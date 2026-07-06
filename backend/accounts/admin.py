from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Ներմուծում ենք Unfold-ի դասերը
from unfold.admin import ModelAdmin, StackedInline

from .models import Customer, OTPVerification



class OTPVerificationInline(StackedInline):
    model = OTPVerification
    extra = 0
    can_delete = False

@admin.register(Customer)
class CustomerAdmin(ModelAdmin, BaseUserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    inlines = [OTPVerificationInline]
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('is_email_verified', 'country', 'city', 'street', 'postal_code')}),
    )

@admin.register(OTPVerification)
class OTPVerificationAdmin(ModelAdmin):
    list_display = ('user', 'otp_code', 'created_at')
    search_fields = ('user__username', 'user__email', 'otp_code')