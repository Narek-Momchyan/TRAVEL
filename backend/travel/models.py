from django.db import models

from django.core.validators import FileExtensionValidator
from django.conf import settings

class Logo(models.Model):
    img_route = models.ImageField(upload_to='images/' , null=True, blank=True)

    def __str__(self):
        return "Logo"


class Navbar(models.Model):
    lang = models.CharField(max_length=10)
    label = models.CharField(max_length=255)
    route = models.CharField(max_length=255, null=True, blank=True) 

    def __str__(self):
        return self.label


class Dropdown(models.Model):
    navbar = models.ForeignKey(Navbar, on_delete=models.CASCADE, related_name='dropdown' , null=True, blank=True)
    label = models.CharField(max_length=255, null=True, blank=True)
    lang = models.CharField(max_length=10, null=True, blank=True)
    route = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.label



class Languages(models.Model):
    code = models.CharField(max_length=10)
    label = models.CharField(max_length=50)
    img_route = models.FileField(upload_to='images/languages/', validators=[FileExtensionValidator(['svg', 'png', 'jpg', 'jpeg'])])

    def __str__(self):
        return self.label


class Homeimg(models.Model):
    Homeimg = models.ImageField(upload_to='images/home/')

    def __str__(self):
        return "Homeimg"


class Hero_info(models.Model):
    lang = models.CharField(max_length=10)
    icon_route = models.FileField(upload_to='images/hero_info/')
    title = models.CharField(max_length=255)
    subtitle = models.TextField()
    button_text = models.CharField(max_length=100)
    button_route = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.title


class product(models.Model):
    title = models.CharField(max_length=20)
    tag = models.CharField(max_length=10)
    price = models.IntegerField() 
    discount_percentage = models.PositiveIntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=5)
    is_popular = models.BooleanField(default=False)
    description = models.TextField(max_length=150)
    search_keywords = models.CharField(max_length=500, blank=True, null=True, help_text="Enter synonyms for search (e.g. 'Paris, Փարիզ, պարիս')")
    lang = models.CharField(max_length=10, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.lang})"


class TourImage(models.Model):
    tour = models.ForeignKey(product, on_delete=models.CASCADE, related_name='images')
    image_route = models.ImageField(upload_to='images/tour/')

    def __str__(self):
        return f"Image for {self.image_route}"

class Rating(models.Model):
    lang = models.CharField(max_length=10)
    text = models.TextField(max_length=100)
    rating = models.IntegerField()

    def __str__(self):
        return self.text
    
class compaines(models.Model):
    images = models.ImageField(upload_to='images/compaines/')

    def __str__(self):
        return f"Image for {self.images}"

class MainTitle(models.Model):
    lang = models.CharField(max_length=10, default='en')
    title = models.CharField(max_length=25, default='')

    def __str__(self):
        return self.title

class Item(models.Model):
    lang = models.CharField(max_length=10, default='en')
    title = models.CharField(max_length=25, default='')
    content = models.TextField(default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class SectionImage(models.Model):
    
    image = models.ImageField(upload_to='images/tours')

    def __str__(self):
        return "Image"

class About(models.Model):
    lang = models.CharField(max_length=10)
    title1 = models.CharField(max_length=100)
    description1 = models.TextField()
    title2 = models.CharField(max_length=100)
    description2 = models.TextField()
    images1 =  models.ImageField(upload_to='images/about/')
    images2 =  models.ImageField(upload_to='images/about/')
    images3 =  models.ImageField(upload_to='images/about/')

    def __str__(self):
        return f"about-us"

    
class myTeam(models.Model):
    label = models.CharField(max_length=20)
    lang = models.CharField(max_length=10)
    name = models.CharField(max_length=20)
    images = models.ImageField(upload_to='images/myTeam/')

    def __str__(self):
        return self.name



class footer(models.Model):
    lang = models.CharField(max_length=10)

    logo = models.ImageField(upload_to='images/footerLogos/', blank=True, null=True)
    facebook_url = models.URLField(max_length=50, blank=True, null=True)
    twitter_url = models.URLField(max_length=50, blank=True, null=True)
    instagram_url = models.URLField(max_length=50, blank=True, null=True)
    linkedin_url = models.URLField(max_length=50, blank=True, null=True)
    telegram_url = models.URLField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=30)
    address = models.CharField(max_length=100)
    copyright_text = models.CharField(max_length=100, default='© 2025 Created by Asta & Poghos | All rights reserved.')

 
    def __str__(self):
        return "footer"
    

class ProfileTranslation(models.Model):
    lang = models.CharField(max_length=10, unique=True)
    page_title = models.CharField(max_length=100, default="My Profile")
    page_subtitle = models.CharField(max_length=200, default="Manage your account and booking settings.")
    account_details_title = models.CharField(max_length=100, default="Account Details")
    address_info_title = models.CharField(max_length=100, default="Address Info")
    logout_btn = models.CharField(max_length=50, default="Log Out")
    edit_btn = models.CharField(max_length=50, default="Edit Profile")
    save_btn = models.CharField(max_length=50, default="Save Changes")
    cancel_btn = models.CharField(max_length=50, default="Cancel")
    
    username_label = models.CharField(max_length=50, default="Username")
    email_label = models.CharField(max_length=50, default="Email Address")
    first_name_label = models.CharField(max_length=50, default="First Name")
    last_name_label = models.CharField(max_length=50, default="Last Name")
    location_label = models.CharField(max_length=50, default="Location")
    street_postal_label = models.CharField(max_length=50, default="Street / Postal Code")
    verified_badge = models.CharField(max_length=50, default="Verified")
    no_address_text = models.CharField(max_length=200, default="You haven't set up an address yet.")
    
    def __str__(self):
        return f"Profile Translations ({self.lang})"

class AuthTranslation(models.Model):
    lang = models.CharField(max_length=10, unique=True)
    login_tab = models.CharField(max_length=50, default="Log In")
    signup_tab = models.CharField(max_length=50, default="Sign Up")
    welcome_back_title = models.CharField(max_length=100, default="Welcome Back")
    welcome_back_subtitle = models.CharField(max_length=200, default="Sign in to access your account")
    create_account_title = models.CharField(max_length=100, default="Create an Account")
    create_account_subtitle = models.CharField(max_length=200, default="Join us today to get started")
    verify_account_title = models.CharField(max_length=100, default="Verify Your Account")
    verify_account_subtitle = models.CharField(max_length=200, default="Enter the 6-digit code sent to you")
    add_address_title = models.CharField(max_length=100, default="Add Your Address")
    add_address_subtitle = models.CharField(max_length=200, default="Where should we send your bookings?")
    
    email_username_label = models.CharField(max_length=100, default="Email or Username")
    password_label = models.CharField(max_length=50, default="Password")
    username_label = models.CharField(max_length=50, default="Username *")
    email_label = models.CharField(max_length=50, default="Email Address *")
    country_label = models.CharField(max_length=50, default="Country *")
    city_label = models.CharField(max_length=50, default="City / Region *")
    street_label = models.CharField(max_length=50, default="Street Address *")
    postal_code_label = models.CharField(max_length=50, default="Postal Code / Zip")
    code_label = models.CharField(max_length=50, default="6-Digit Code")
    

    signin_btn = models.CharField(max_length=50, default="Sign In")
    signup_btn = models.CharField(max_length=50, default="Continue to Verification")
    verify_btn = models.CharField(max_length=50, default="Verify & Continue")
    skip_btn = models.CharField(max_length=50, default="Skip for now")
    save_profile_btn = models.CharField(max_length=50, default="Save Profile")
    
    err_fill_email_or_phone = models.CharField(max_length=200, default="Please fill in either email or phone number.")
    msg_code_sent = models.CharField(max_length=200, default="Code sent. Please verify.")
    err_registration_failed = models.CharField(max_length=200, default="Registration error. Data might already be in use.")
    msg_login_success = models.CharField(max_length=200, default="You have successfully logged in. You can now add your address.")
    err_invalid_code = models.CharField(max_length=200, default="Invalid code. Please try again.")
    msg_profile_complete = models.CharField(max_length=200, default="Your profile is fully completed!")
    err_address_save_failed = models.CharField(max_length=200, default="Failed to save address.")
    
    step1_title = models.CharField(max_length=100, default="Registration")
    step2_title = models.CharField(max_length=100, default="Verification")
    step3_title = models.CharField(max_length=100, default="Personal Information")
    
    lbl_username_asterisk = models.CharField(max_length=100, default="Username *")
    lbl_fill_email_or_phone = models.CharField(max_length=100, default="Fill in email OR phone number")
    lbl_email = models.CharField(max_length=100, default="Email")
    lbl_or = models.CharField(max_length=50, default="- OR -")
    lbl_phone = models.CharField(max_length=100, default="Phone Number")
    lbl_password_asterisk = models.CharField(max_length=100, default="Password *")
    
    btn_register = models.CharField(max_length=50, default="Register")
    btn_wait = models.CharField(max_length=50, default="Wait...")
    
    lbl_enter_code = models.CharField(max_length=100, default="Enter 6-digit code")
    btn_verify = models.CharField(max_length=50, default="Verify")
    btn_verifying = models.CharField(max_length=50, default="Verifying...")
    
    lbl_country_asterisk = models.CharField(max_length=100, default="Country *")
    lbl_city_asterisk = models.CharField(max_length=100, default="City / Region *")
    lbl_street_asterisk = models.CharField(max_length=100, default="Street & Building *")
    lbl_postal_code_no_asterisk = models.CharField(max_length=100, default="Postal Code")
    
    btn_skip_action = models.CharField(max_length=50, default="Skip")
    btn_save_address = models.CharField(max_length=50, default="Save Address")
    btn_saving = models.CharField(max_length=50, default="Saving...")
    
    def __str__(self):
        return f"Auth Translations ({self.lang})"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user} likes {self.product}"
