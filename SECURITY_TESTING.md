# Security Testing Checklist

## Pre-Deployment Security Tests

Before deploying to production, test these critical authentication flows:

### 1. Registration Tests

#### Valid Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```
**Expected:** 201 Created, OTP sent to email

#### Duplicate Email
```bash
# Register the same email twice
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```
**Expected:** 409 Conflict

#### Weak Password
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@example.com",
    "password": "weak"
  }'
```
**Expected:** 400 Bad Request

#### Client Attempts Role Injection
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hacker",
    "email": "hacker@example.com",
    "password": "Password123!",
    "role": "admin"
  }'
```
**Expected:** 201 Created, but user has role "user" (check in database)

#### Missing Fields
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com"
  }'
```
**Expected:** 400 Bad Request

### 2. OTP Verification Tests

#### Correct OTP
```bash
# Use the OTP from your email
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```
**Expected:** 200 OK

#### Incorrect OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "000000"
  }'
```
**Expected:** 400 Bad Request

#### Five Failed Attempts → Sixth Attempt
```bash
# Try 6 times with wrong OTP
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/verify-email \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "code": "000000"
    }'
  echo ""
done
```
**Expected:** After 5th attempt, 6th returns 429 Too Many Requests

#### Expired OTP
```bash
# Wait 11 minutes after registration, then try
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```
**Expected:** 400 Bad Request (expired)

#### Reuse OTP After Successful Verification
```bash
# After successful verification, try the same OTP again
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```
**Expected:** 400 Bad Request (already verified or OTP cleared)

### 3. Resend OTP Tests

#### Valid Resend
```bash
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```
**Expected:** 200 OK

#### Resend Within Cooldown
```bash
# Immediately send again
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```
**Expected:** 200 OK (generic response, but no email sent due to cooldown)

#### Previous OTP Invalid After Resend
```bash
# Try old OTP after resending
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "OLD_OTP_HERE"
  }'
```
**Expected:** 400 Bad Request (old OTP replaced)

#### Nonexistent Email
```bash
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com"
  }'
```
**Expected:** 200 OK (generic response, doesn't leak user existence)

### 4. Authentication Tests

#### Unverified User Login
```bash
# Create user but don't verify email, then try to login
# Registration returns unverified user
# Login should fail
```
**Expected:** Login returns error (email not verified)

#### Verified User Login
```bash
# After email verification
# Login through the UI or API
```
**Expected:** Login succeeds, session created

#### Legacy User Login (emailVerified === undefined)
```bash
# Manually set a user in database with no emailVerified field
# Try to login
```
**Expected:** Login succeeds (backward compatibility)

#### Invalid Password
```bash
# Try login with wrong password
```
**Expected:** Login fails with generic error message

#### Nonexistent User
```bash
# Try login with email that doesn't exist
```
**Expected:** Login fails with generic error message (same as invalid password)

### 5. Authorization Tests

#### Unauthenticated Request
```bash
curl http://localhost:3000/api/auth/test-roles
```
**Expected:** 401 Unauthorized

#### Authenticated User (role: "user") → Editor Endpoint
```bash
# Login as user, get session cookie, then:
curl http://localhost:3000/api/auth/test-roles \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```
**Expected:** 403 Forbidden (requires editor)

#### Authenticated Editor → Editor Endpoint
```bash
# Login as editor, then:
curl http://localhost:3000/api/auth/test-roles \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```
**Expected:** 200 OK

#### Authenticated Admin → Editor Endpoint
```bash
# Login as admin, then:
curl http://localhost:3000/api/auth/test-roles \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```
**Expected:** 200 OK (admin >= editor)

#### Client Attempts to Manipulate Role in Request
```bash
# Try sending role in request body/headers
curl http://localhost:3000/api/auth/test-roles \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -H "X-Role: admin" \
  -d '{"role": "admin"}'
```
**Expected:** Role ignored, authorization based on session only

### 6. Race Condition Tests

#### Concurrent OTP Verification (Attempt Counter)
```bash
# Send 10 concurrent wrong OTP requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/verify-email \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "code": "000000"
    }' &
done
wait
```
**Expected:** Should block after 5 attempts, even with concurrent requests

#### Concurrent Resend OTP (Cooldown Bypass)
```bash
# Send 5 concurrent resend requests
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/auth/resend-otp \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com"
    }' &
done
wait
```
**Expected:** Only one should succeed in updating OTP (atomic operation)

#### Concurrent Registration (Duplicate Email)
```bash
# Send 2 concurrent registration requests with same email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User1",
    "email": "race@example.com",
    "password": "Password123!"
  }' &
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User2",
    "email": "race@example.com",
    "password": "Password123!"
  }' &
wait
```
**Expected:** Only one succeeds (requires unique email index in MongoDB)

### 7. Error Message Security

Verify all error messages are generic and don't leak:
- Stack traces
- MongoDB errors
- User existence
- Password hashes
- OTP values
- SMTP credentials
- Database schema details

### 8. Database Security

#### Check Password Storage
```javascript
// In MongoDB
db.users.findOne({ email: "test@example.com" })
```
**Expected:** 
- `passwordHash` present (bcrypt hash starting with $2a$ or $2b$)
- NO `password` field
- `emailVerificationCodeHash` is a hex string (HMAC)
- NO `emailVerificationCode` field

#### Check Role Assignment
```javascript
db.users.findOne({ email: "test@example.com" })
```
**Expected:** `role: "user"` for new registrations

#### Check Unique Email Index
```javascript
db.users.getIndexes()
```
**Expected:** Index on `{ email: 1 }` with `unique: true`

### 9. Frontend Security

- ✅ No passwords in localStorage/sessionStorage
- ✅ No OTPs in localStorage/sessionStorage
- ✅ No sensitive data in URL parameters
- ✅ Passwords masked in input fields
- ✅ CSRF protection (NextAuth handles this)

### 10. Production Environment Tests

Before going live, verify:

```bash
# AUTH_SECRET is set and different from dev
echo $AUTH_SECRET

# Email server configured
echo $EMAIL_SERVER_HOST
echo $EMAIL_SERVER_PORT

# MongoDB connection works
echo $MONGODB_URI

# No .env.local committed
git log --all -- .env.local
```

## Automated Testing Script

Create `scripts/test-auth.sh`:

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "Testing registration..."
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!"}'

echo "\nTesting role injection attempt..."
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","email":"hacker@test.com","password":"Password123!","role":"admin"}'

# Add more tests...
```

## Notes

- These tests should be run in a development/staging environment
- Never test with production user data
- Always clean up test accounts after testing
- Document any new security concerns discovered during testing
