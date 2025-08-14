from twilio.rest import Client

# Your Twilio account SID and auth token
account_sid = 'ACfadbda473483467aa8295d035976f9fa'
auth_token = '5ee4bbd1cf88cda2fbc064e980fb443a'
client = Client(account_sid, auth_token)

# Sending the SMS
message = client.messages.create(
    to="+15738015260",  # Replace with the recipient's phone number
    from_="+18447143170",  # Replace with your Twilio phone number
    body="Hello, this is a text notification from my Python script!"
)

print(f"Message SID: {message.sid}")
