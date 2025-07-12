from flask import Flask, request, render_template
from flask_cors import CORS

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

app = Flask(__name__)
CORS(app)

# Gmail SMTP 서버 설정
SENDER_EMAIL = "faxul200@gmail.com"
SENDER_PASSWORD = 'arlw dfrd fztb ojae'  # Gmail 앱 비밀번호 또는 2단계 인증 시 생성한 비밀번호 사용

# 텍스트가 한글인지 확인하는 함수
def is_korean(text):
    return bool(re.search("[가-힣]", text))

# 이메일 전송 함수
def send_email(subject, recipient_email, message):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, "html"))
    try:
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        print("Email sent successfully!")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
    finally:
        server.quit()

@app.route('/mail', methods=['POST'])
def mail_proc():
    data = request.json
    subject = data['subject']
    recipient_email = data['recipient_email']
    message = data['message']
    if subject and recipient_email and message:
        if send_email(subject, recipient_email, message):
            print('Email sent successfully!')
        else:
            print('Failed to send email.')
    return {"subject": subject, "recipient_email": recipient_email, "message": message}

@app.route('/')
def index():
    return "메일 전송 서버가 실행 중입니다."

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
