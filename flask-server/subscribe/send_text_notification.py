from twilio.rest import Client

# Your Twilio account SID and auth token
account_sid = '<twilio id>'
auth_token = '<teilio secret>'
client = Client(account_sid, auth_token)

# Sending the SMS
message = client.messages.create(
    to="+",  # Replace with the recipient's phone number
    from_="+",  # Replace with your Twilio phone number
    body="Hello, this is a text notification from my Python script!"
)

print(f"Message SID: {message.sid}")
