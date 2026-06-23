import json
from google import genai
from google.genai import types
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.conf import settings
from .models import ChatSession, ChatMessage
from django.utils import timezone
from datetime import timedelta
client = genai.Client(api_key=getattr(settings, 'GEMINI_API_KEY', ''))

class AIChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
        else:
            await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user_message = text_data_json.get('message')
        session_id = text_data_json.get('session_id')
        language = text_data_json.get('language', 'hy')

        if not user_message:
            await self.send(text_data=json.dumps({'error': 'Նամակը դատարկ է'}))
            return

        user = self.scope["user"]

        session, formatted_history = await self.save_user_message_and_get_history(
            user, user_message, session_id, language
        )

        system_instruction = self.get_system_prompt(user.first_name)

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
            )

            chat = client.chats.create(
                model="gemini-flash-lite-latest",
                config=config,
                history=formatted_history
            )

            send_message_sync = sync_to_async(chat.send_message)
            response = await send_message_sync(user_message)
            ai_response_text = response.text

            await self.save_ai_message(session, ai_response_text)

            await self.send(text_data=json.dumps({
                'role': 'model',
                'content': ai_response_text,
                'session_id': session.id
            }))

        except Exception as e:
            print("Gemini API Error:", e)
            await self.send(text_data=json.dumps({
                'error': 'Service error. Try again later.'
            }))
    @database_sync_to_async
    def save_user_message_and_get_history(self, user, message, session_id, language):
        time_limit = timezone.now() - timedelta(days=1)
        ChatSession.objects.filter(user=user, updated_at__lt=time_limit).delete()
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=user)
            except ChatSession.DoesNotExist:
                title_preview = message[:30] + '...' if len(message) > 30 else message
                session = ChatSession.objects.create(user=user, title=title_preview, language=language)
        else:
            title_preview = message[:30] + '...' if len(message) > 30 else message
            session = ChatSession.objects.create(user=user, title=title_preview, language=language)

        ChatMessage.objects.create(session=session, role='user', content=message)
        
        history_msgs = session.messages.all().order_by('timestamp')[:20]
        formatted_history = [
            {"role": msg.role, "parts": [{"text": msg.content}]} 
            for msg in history_msgs
        ]
        return session, formatted_history
    @database_sync_to_async
    def save_ai_message(self, session, content):
        ChatMessage.objects.create(session=session, role='model', content=content)

    def get_system_prompt(self, user_name):
        name_to_use = user_name if user_name else ""
        
        return f"""You are a professional, friendly, and highly knowledgeable AI Tour Guide for our travel agency. 
        You are talking to {name_to_use}. 
        Your goal is to help them plan their perfect trip, recommend destinations, and answer travel-related questions.
        
        CRITICAL RULES:
        1. ALWAYS reply in the exact same language the user is writing in (e.g., if the user writes in Armenian, reply in Armenian; if Russian, reply in Russian; if English, reply in English).
        2. Be concise but inspiring.
        3. Do not invent fake flight prices or fake booking links.
        4. If a question is not about travel, politely redirect the conversation back to travel planning.
        """