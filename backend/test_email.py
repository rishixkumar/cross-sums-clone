from app.email_utils import send_reset_email

try:
    send_reset_email("rishmadras@gmail.com", "123456")
    print("Test email sent!")
except Exception as e:
    print(f"Test failed: {e}")
