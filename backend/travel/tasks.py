# travel/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task(bind=True, max_retries=3)
def send_contact_email_task(self, name, email, message):
    subject = f"Tour agency message from {name}"
    body = f"Name: {name}\nEmail: {email}\nMessage:\n{message}"
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.EMAIL_HOST_USER, 
            recipient_list=['narekmomchyan80@gmail.com'],
            fail_silently=False, 
        )
        return "Success"
    except Exception as exc:
        print(f"Failed to send email via Gmail: {exc}")
        raise self.retry(exc=exc, countdown=10)