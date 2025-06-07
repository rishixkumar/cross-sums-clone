import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from settings import EMAIL_USER, EMAIL_PASS, EMAIL_FROM

def send_reset_email(to_email, reset_token):
    try:
        print(f"Attempting to send email to: {to_email}")
        print(f"Using EMAIL_USER: {EMAIL_USER}")
        print(f"Using EMAIL_FROM: {EMAIL_FROM}")
        print(f"EMAIL_PASS configured: {'Yes' if EMAIL_PASS else 'No'}")
        
        subject = "Cross Sums Password Reset"
        body = f"Use this code to reset your password: {reset_token}\n\nThis code expires in 15 minutes."
        
        msg = MIMEMultipart()
        msg["From"] = EMAIL_FROM
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        print("Connecting to Gmail SMTP server via TLS...")
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Enable TLS
            print("TLS enabled. Attempting login...")
            server.login(EMAIL_USER, EMAIL_PASS)
            print("Login successful. Sending email...")
            server.sendmail(EMAIL_FROM, to_email, msg.as_string())
            print(f"Email sent successfully to {to_email}")
            
    except smtplib.SMTPAuthenticationError as e:
        print(f"Gmail authentication failed: {str(e)}")
        print("1. Ensure 2-Step Verification is ON")
        print("2. Generate a new App Password for 'Mail'")
        raise e
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise e
