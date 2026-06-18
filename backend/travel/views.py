from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny

from .filters import TourPackageFilter
from .models import (
    Logo, Navbar, Dropdown, Languages, Homeimg, Hero_info,
    product, TourImage, Rating, compaines, MainTitle, Item, SectionImage,
    About, myTeam, footer, ProfileTranslation, AuthTranslation, Favorite
)
from .serializers import (
    ContactSerializer,
    LogoSerializer, NavbarSerializer, DropdownSerializer, LanguagesSerializer,
    HomeimgSerializer, HeroInfoSerializer, TourPackageSerializer,
    RatingSerializer, CompainesSerializer, MainTitleSerializer,
    ItemSerializer, SectionImageSerializer,
    AboutSerializer, MyTeamSerializer, footerSerializer, ProfileTranslationSerializer, AuthTranslationSerializer,FavoriteSerializer
)


class BulkCreateMixin:

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)


class SingleImageBaseViewSet(viewsets.ModelViewSet):

    image_field_name = 'image'

    def list(self, request, *args, **kwargs):
        obj = self.get_queryset().first()
        if not obj or not getattr(obj, self.image_field_name):
            return Response({"image": None})
        
        image_field = getattr(obj, self.image_field_name)
        return Response({
            "image": request.build_absolute_uri(image_field.url)
        })



class LogoViewSet(SingleImageBaseViewSet):
    queryset = Logo.objects.all().order_by('id')
    serializer_class = LogoSerializer
    image_field_name = 'img_route'


class HomeimgViewSet(SingleImageBaseViewSet):
    queryset = Homeimg.objects.all().order_by('id')
    serializer_class = HomeimgSerializer
    image_field_name = 'Homeimg'


class SectionImageViewSet(SingleImageBaseViewSet):
    queryset = SectionImage.objects.all().order_by('id')
    serializer_class = SectionImageSerializer
    image_field_name = 'image'


class LanguagesViewSet(BulkCreateMixin, viewsets.ModelViewSet):
    queryset = Languages.objects.all().order_by('id')
    serializer_class = LanguagesSerializer


class NavbarViewSet(BulkCreateMixin, viewsets.ModelViewSet):
    queryset = Navbar.objects.prefetch_related('dropdown').all().order_by('id')
    serializer_class = NavbarSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']


class HeroInfoViewSet(BulkCreateMixin, viewsets.ModelViewSet):
    queryset = Hero_info.objects.all().order_by('id')
    serializer_class = HeroInfoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']


class ProductViewSet(BulkCreateMixin, viewsets.ModelViewSet):
    queryset = product.objects.prefetch_related('images').all().order_by('-id')
    serializer_class = TourPackageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TourPackageFilter

    def filter_queryset(self, queryset):
        if self.action == 'retrieve':
            return queryset
        return super().filter_queryset(queryset)



class PopularItemsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = product.objects.prefetch_related('images').filter(is_popular=True).order_by('id')
    serializer_class = TourPackageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['lang']
    search_fields = ['title', 'price','rating','tag']


class RatingViewSet(BulkCreateMixin, viewsets.ModelViewSet):
    queryset = Rating.objects.all().order_by('id')
    serializer_class = RatingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']


class DropdownViewSet(viewsets.ModelViewSet):
    queryset = Dropdown.objects.all()
    serializer_class = DropdownSerializer


class CompainesViewSet(viewsets.ModelViewSet):
    queryset = compaines.objects.all()
    serializer_class = CompainesSerializer


class MainTitleViewSet(viewsets.ModelViewSet):
    queryset = MainTitle.objects.all()
    serializer_class = MainTitleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']


class WhyChooseUsViewSet(viewsets.ViewSet):

    def list(self, request):
        lang = request.query_params.get('lang', 'en')
        main_title = MainTitle.objects.filter(lang=lang).first()
        items = Item.objects.filter(lang=lang).order_by('order', 'id')
        section_image = SectionImage.objects.first()

        image_url = None
        if section_image and section_image.image:
            image_url = request.build_absolute_uri(section_image.image.url)

        return Response({
            "mainTitle": MainTitleSerializer(main_title, context={'request': request}).data.get("title", "") if main_title else "",
            "items": ItemSerializer(items, many=True, context={'request': request}).data,
            "image": image_url
        })


class ContactViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            import requests
            import os
            import threading
            
            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']
            
            resend_api_key = os.getenv('RESEND_API_KEY')
            
            if not resend_api_key:
                return Response({"error": "Resend API key is missing. Please configure it in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            headers = {
                'Authorization': f'Bearer {resend_api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "from": "Contact Form <onboarding@resend.dev>",
                "to": ["narekmomchyan80@gmail.com"],
                "subject": f"Tour agency message from {name}",
                "html": f"<p><strong>Name:</strong> {name}</p><p><strong>Email:</strong> {email}</p><p><strong>Message:</strong><br>{message}</p>",
                "reply_to": email
            }

            def send_contact_email(headers, payload):
                try:
                    requests.post('https://api.resend.com/emails', headers=headers, json=payload)
                except Exception as e:
                    print(f"Failed to send contact email from {email}: {e}")

            threading.Thread(target=send_contact_email, args=(headers, payload)).start()
            
            return Response({"success": "Your message was sent successfully:"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AboutVievs(BulkCreateMixin,viewsets.ModelViewSet):
    queryset = About.objects.all().order_by('id')
    serializer_class = AboutSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']

class MyTeamVievs(BulkCreateMixin,viewsets.ModelViewSet):
    queryset = myTeam.objects.all().order_by('id')
    serializer_class = MyTeamSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang'] 

class footerVievs(BulkCreateMixin,viewsets.ModelViewSet):
    queryset = footer.objects.all().order_by('id')
    serializer_class = footerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']

class ProfileTranslationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProfileTranslation.objects.all()
    serializer_class = ProfileTranslationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']

class AuthTranslationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuthTranslation.objects.all()
    serializer_class = AuthTranslationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lang']



class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        product_obj = get_object_or_404(product, id=product_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, product=product_obj)
        
        if not created:
            favorite.delete()
            return Response({"status": "removed", "product_id": product_id}, status=status.HTTP_200_OK)
            
        return Response({"status": "added", "product_id": product_id}, status=status.HTTP_201_CREATED)
