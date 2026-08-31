# Database Security Setup

## Required MongoDB Index

To prevent race conditions during user registration and ensure email uniqueness at the database level, you must create a unique index on the `email` field.

### How to Create the Index

Connect to your MongoDB Atlas cluster and run:

```javascript
use your_database_name;

db.users.createIndex(
  { email: 1 },
  { 
    unique: true,
    name: "unique_email_index"
  }
);
```

### Verify the Index

```javascript
db.users.getIndexes();
```

You should see an index with:
- `key: { email: 1 }`
- `unique: true`

### What This Prevents

Without this index, two concurrent registration requests with the same email could both pass the `findOne` check and both insert a user document, creating duplicate accounts. The unique index provides atomic enforcement at the database level.

## Orphan Account Cleanup (Optional Future Enhancement)

If you want to clean up unverified accounts that never completed email verification, do NOT use a MongoDB TTL index on `createdAt` - that would delete all users after a certain time.

Instead, implement a scheduled job (cron/lambda) that runs periodically with a targeted query:

```javascript
// Example: Delete unverified users older than 7 days
const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

db.users.deleteMany({
  emailVerified: false,
  createdAt: { $lt: cutoffDate }
});
```

This safely targets only unverified accounts without affecting legitimate users.

## Email Server Configuration

Ensure these environment variables are set in production:

```bash
EMAIL_SERVER_HOST=your-smtp-server.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-smtp-username
EMAIL_SERVER_PASSWORD=your-smtp-password
EMAIL_FROM="Your App Name <noreply@yourdomain.com>"
```

**NEVER commit these values to Git.**

The system will fail securely if email configuration is missing in production.

## AUTH_SECRET Security

The `AUTH_SECRET` environment variable is critical for:
- JWT session signing (NextAuth)
- OTP HMAC generation (email verification)

**Requirements:**
- Must be a cryptographically random string (minimum 32 bytes)
- Must be unique per environment
- Must NEVER be committed to Git
- Production deployments will fail if AUTH_SECRET is missing

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

Your current `.env.local` has a secure AUTH_SECRET. Ensure production uses a different secret.
