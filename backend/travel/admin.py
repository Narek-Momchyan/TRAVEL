
from django.contrib import admin
from unfold.admin import ModelAdmin 
from .models import (
    Logo, Navbar, Dropdown, Languages, HomeVideo, Hero_info, product, 
    TourImage, Rating, compaines, MainTitle, Item, SectionImage, 
    About, myTeam, footer, ProfileTranslation, AuthTranslation, Favorite
)


models_to_register = [
    Logo, Navbar, Dropdown, Languages, HomeVideo, Hero_info, product, 
    TourImage, Rating, compaines, MainTitle, Item, SectionImage, 
    About, myTeam, footer, ProfileTranslation, AuthTranslation, Favorite
]


for model in models_to_register:
    admin.site.register(model, ModelAdmin)