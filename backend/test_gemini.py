import google.generativeai as genai
import os
import sys

key = os.environ.get('GEMINI_KEY') or ''
if not key:
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('GEMINI_KEY='):
                key = line.split('=')[1].strip()

genai.configure(api_key=key)

try:
    model = genai.GenerativeModel(
        model_name="gemini-flash-lite-latest"
    )
    response = model.generate_content("hello")
    print("SUCCESS")
except Exception as e:
    print("ERROR:", e)
    sys.exit(1)
