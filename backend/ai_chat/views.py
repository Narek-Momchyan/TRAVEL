import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from django.conf import settings
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer

genai.configure(api_key=getattr(settings, 'GEMINI_API_KEY', ''))

class ChatInteractionView(APIView):

    permission_classes = [IsAuthenticated]

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat_limit'
    
    def post(self, request):
        user_message = request.data.get('message')
        session_id = request.data.get('session_id')
        language = request.data.get('language', 'hy')

        if not user_message:
            return Response(
                
                status=status.HTTP_400_BAD_REQUEST
            )

        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response( status=status.HTTP_404_NOT_FOUND)
        else:
            title_preview = user_message[:30] + '...' if len(user_message) > 30 else user_message
            session = ChatSession.objects.create(
                user=request.user, 
                title=title_preview,
                language=language
            )

        ChatMessage.objects.create(session=session, role='user', content=user_message)
        system_instruction = self.get_system_prompt(request.user.first_name, session.language)
        history_msgs = session.messages.all().order_by('timestamp')[:20] 
        formatted_history = [
            {"role": msg.role, "parts": [{"text": msg.content}]} 
            for msg in history_msgs
        ]

        try:
            model = genai.GenerativeModel(
                model_name="gemini-flash-lite-latest",
                system_instruction=system_instruction
            )
            chat = model.start_chat(history=formatted_history)
            response = chat.send_message(user_message)
            ai_response_text = response.text
            ChatMessage.objects.create(session=session, role='model', content=ai_response_text)
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Gemini API Error:", e)
            return Response(
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    def get_system_prompt(self, user_name, language):
       
        name_to_use = user_name if user_name else ""

        if language == 'en':
            return f"""You are a professional, friendly, and highly knowledgeable AI Tour Guide for our travel agency. 
            You are talking to {name_to_use}. 
            Your goal is to help them plan their perfect trip, recommend destinations, and answer travel-related questions.
            Rules:
            1. ONLY answer in English.
            2. Be concise but inspiring.
            3. Do not invent fake flight prices or fake booking links.
            4. If a question is not about travel, politely redirect the conversation back to travel planning.
            """
        else:
            return f"""Դու պրոֆեսիոնալ, ընկերական և բանիմաց վիրտուալ Տուրիստական Գիդ ես մեր տուրիստական գործակալության կայքում: 
            Դու զրուցում ես {name_to_use}-ի հետ: 
            Քո նպատակն է օգնել նրան պլանավորել իդեալական ճանապարհորդություն, առաջարկել տուրեր և պատասխանել ճամփորդական հարցերին:
            Կանոններ:
            1. ՄԻՇՏ պատասխանիր հայերենով (հայատառ): 
            2. Եղիր հակիրճ, բայց ոգեշնչող:
            3. Մի հորինիր ավիատոմսերի կեղծ գներ կամ ամրագրման կեղծ հղումներ:
            4. Եթե հարցը չի վերաբերում ճամփորդությանը, քաղաքավարի կերպով թեման վերադարձրու տուրիզմի ոլորտ:
            """