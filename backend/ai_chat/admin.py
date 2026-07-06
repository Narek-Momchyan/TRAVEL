from django.contrib import admin
from .models import ChatSession, ChatMessage
from unfold.admin import ModelAdmin


models_to_register=[
    ChatSession, ChatMessage
]

for model in models_to_register:
    admin.site.register(model, ModelAdmin)




