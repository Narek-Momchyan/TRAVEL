from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
     LogoViewSet, HomeimgViewSet, LanguagesViewSet,
    NavbarViewSet, DropdownViewSet, HeroInfoViewSet, ProductViewSet,
    RatingViewSet, CompainesViewSet, MainTitleViewSet, ItemViewSet, 
    SectionImageViewSet, WhyChooseUsViewSet, PopularItemsViewSet, ContactViewSet,
    AboutVievs, MyTeamVievs, footerVievs, ProfileTranslationViewSet, AuthTranslationViewSet,
    FavoriteViewSet
)
from rest_framework_simplejwt.views import TokenVerifyView

router = DefaultRouter()
router.register(r'logos', LogoViewSet, basename='logos')
router.register(r'homeimgs', HomeimgViewSet, basename='homeimgs')
router.register(r'languages', LanguagesViewSet)
router.register(r'navbars', NavbarViewSet, basename='navbars')
router.register(r'dropdowns', DropdownViewSet)
router.register(r'hero-info', HeroInfoViewSet, basename='hero-info')
router.register(r'products', ProductViewSet) 
router.register(r'popular-items', PopularItemsViewSet, basename='popular-items')
router.register(r'ratings', RatingViewSet, basename='ratings')
router.register(r'companies', CompainesViewSet)
router.register(r'main-titles', MainTitleViewSet)
router.register(r'items', ItemViewSet)
router.register(r'section-images', SectionImageViewSet, basename='section-images')
router.register(r'why-choose-us', WhyChooseUsViewSet, basename='why-choose-us')
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'about', AboutVievs, basename='about')
router.register(r'team', MyTeamVievs, basename='team')
router.register(r'footer', footerVievs, basename='footer')
router.register(r'profile-translations', ProfileTranslationViewSet, basename='profile-translations')
router.register(r'auth-translations', AuthTranslationViewSet, basename='auth-translations')
router.register(r'favorites', FavoriteViewSet, basename='favorites')
urlpatterns = [
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('', include(router.urls)),
]