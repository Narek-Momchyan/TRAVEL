from django.urls import path
from .views import ChatHistoryView

app_name = 'ai_chat'

urlpatterns = [
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
]