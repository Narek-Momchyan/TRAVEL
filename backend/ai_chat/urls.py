from django.urls import path
from .views import ChatInteractionView

app_name = 'ai_chat'

urlpatterns = [
    path('interact/', ChatInteractionView.as_view(), name='interact'),
]