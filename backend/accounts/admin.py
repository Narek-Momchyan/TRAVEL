from django.contrib import admin
from .models import Customer, OTPVerification

from django.contrib.auth.admin import UserAdmin

class OTPVerificationInline(admin.StackedInline):
    model = OTPVerification
    extra = 0
    can_delete = False

@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    inlines = [OTPVerificationInline]
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('is_email_verified', 'country', 'city', 'street', 'postal_code')}),
    )

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'created_at')
    search_fields = ('user__username', 'user__email', 'otp_code')
