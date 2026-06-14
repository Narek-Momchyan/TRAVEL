from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class ChatSession(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='chat_sessions',
        help_text=_("The user who owns this chat session.")
    )
    title = models.CharField(max_length=255, default=_("New Chat"))
    language = models.CharField(max_length=10, default='en')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = _('Chat Session')
        verbose_name_plural = _('Chat Sessions')

    def __str__(self):
        return f"Session {self.id} | {self.user.username} [{self.language.upper()}]"


class ChatMessage(models.Model):

    ROLE_CHOICES = (
        ('user', _('User')),
        ('model', _('AI Guide')),
    )

    session = models.ForeignKey(
        ChatSession, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['timestamp']
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')

    def __str__(self):
        return f"{self.session.id} | {self.role}: {self.content[:30]}..."