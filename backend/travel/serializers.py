from codecs import __all__
from rest_framework import serializers
from .models import (
    Logo, Navbar, Dropdown, Languages, Homeimg, Hero_info,
    product, Rating, compaines, MainTitle, Item, SectionImage,
    About, myTeam, footer, ProfileTranslation, AuthTranslation
)



class LogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logo
        fields = ['img_route']

class HomeimgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homeimg
        fields = ['Homeimg']

class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = ['id', 'code', 'label', 'img_route']



class DropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dropdown
        fields = ['id', 'label', 'lang', 'route']

class NavbarSerializer(serializers.ModelSerializer):
    dropdown = DropdownSerializer(many=True, required=False)

    class Meta:
        model = Navbar
        fields = ['id', 'lang', 'label', 'route', 'dropdown']

    def create(self, validated_data):
        dropdown_data = validated_data.pop('dropdown', [])
        navbar = Navbar.objects.create(**validated_data)
        for d_data in dropdown_data:
            Dropdown.objects.create(navbar=navbar, **d_data)
        return navbar



class HeroInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero_info
        fields = ['id', 'lang', 'icon_route', 'title', 'subtitle', 'button_text', 'button_route']





class TourPackageSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        request = self.context.get('request')
        
        return [
            request.build_absolute_uri(img.image_route.url) if request else img.image_route.url
            for img in obj.images.order_by('id') if img.image_route
        ]
    class Meta:
        model = product
        fields = [
            'id', 'title', 'tag', 'price', 'discount_percentage', 
            'rating', 'is_popular', 'description', 'images', 'lang',
            'latitude', 'longitude'
        ]


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'lang', 'text', 'rating']

class CompainesSerializer(serializers.ModelSerializer):
    class Meta:
        model = compaines
        fields = ['id', 'images']




class MainTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainTitle
        fields = ['title']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'title', 'content']


class SectionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionImage
        fields = ['image']

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'

class MyTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = myTeam
        fields = '__all__'

class footerSerializer(serializers.ModelSerializer):
    class Meta:
        model = footer
        fields = '__all__'

class ProfileTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileTranslation
        fields = '__all__'

class AuthTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthTranslation
        fields = '__all__'

from .models import Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    product_details = TourPackageSerializer(source='product', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product', 'product_details', 'created_at']
        read_only_fields = ['user', 'created_at']
