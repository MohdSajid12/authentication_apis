Login

User → email + password
Server →
  - Verify user
  - Generate Access Token (15 min)
  - Generate Refresh Token (7 days)
  - Store refresh token in DB

{
  "accessToken": "xxx",
  "refreshToken": "yyy"
}

User -> email -> password

mail is sent but singup data is submitted and user is failed to submit otp withing 10 minutes then
if user again tries to signup founds user is already exists so then how will he verify that email again