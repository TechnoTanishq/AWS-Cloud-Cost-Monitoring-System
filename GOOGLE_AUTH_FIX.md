# Google OAuth 2.0 Authentication Fix Guide

## Problem Summary
You received a **401 UNAUTHENTICATED** error when trying to sign in with Google. This happens when:
- Google credentials are missing or invalid
- The redirect URI is not registered in Google Console
- The OAuth flow is not properly implemented

## Issues Fixed

### 1. **Incomplete Credentials in .env**
Your `.env` file had a truncated GOOGLE_CLIENT_ID. You need to provide the complete credentials.

### 2. **Conflicting OAuth Implementations**
The code had two different OAuth implementations that interfered:
- One using raw `httpx` requests
- Another using `authlib` (which wasn't properly configured)

**Solution**: Cleaned up to use a single, reliable `httpx`-based implementation.

### 3. **Missing Error Handling**
The original code didn't properly check for errors from Google's API.

**Solution**: Added comprehensive error handling and status code checking.

### 4. **CORS Configuration**
The CORS allowed only `http://localhost:8080`, but your frontend likely runs on a different port (probably 5173 for Vite).

**Solution**: Updated to allow multiple common development ports.

### 5. **Missing Google Login Button**
The login page had no way to initiate Google OAuth.

**Solution**: Added "Sign in with Google" button to the login page.

## Setup Instructions

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Select **Web Application**
6. Add Authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback`
   - `http://localhost:8000` (for local testing)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Update Your .env File

Create or update `/backend/.env`:

```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
```

**Important**: Make sure you paste the **complete** credentials without truncation.

### Step 3: Verify Backend Setup

The backend now has:
- ✅ `/auth/google/login` - Initiates OAuth flow
- ✅ `/auth/google/callback` - Handles OAuth callback
- ✅ Proper error handling and validation
- ✅ Database user creation/lookup
- ✅ JWT token generation

### Step 4: Frontend Setup

The Login page now includes:
- ✅ Email/Password login form (existing)
- ✅ "Sign in with Google" button (new)
- ✅ Proper error handling with toast notifications

## How It Works Now

### Flow Diagram:
```
1. User clicks "Sign in with Google"
   ↓
2. Frontend fetches http://localhost:8000/auth/google/login
   ↓
3. Backend returns Google's auth URL
   ↓
4. Browser redirects to Google's login page
   ↓
5. User authorizes the app
   ↓
6. Google redirects to http://localhost:8000/auth/google/callback?code=...
   ↓
7. Backend exchanges code for access token
   ↓
8. Backend fetches user info from Google
   ↓
9. Backend creates/updates user in database
   ↓
10. Backend generates JWT token and returns user data
    ↓
11. Frontend stores token and redirects to dashboard
```

## Testing the Fix

### 1. **Start Backend**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### 2. **Start Frontend**
```bash
cd frontend
npm run dev
```

### 3. **Test Login**
1. Open http://localhost:5173 (or your frontend URL)
2. Click the "Sign in with Google" button
3. You should be redirected to Google's login
4. After login, you should see a success toast and be redirected to dashboard

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `401 UNAUTHENTICATED` | Invalid/missing credentials | Check .env file has correct Google credentials |
| `redirect_uri_mismatch` | Redirect URI not registered in Google Console | Register `http://localhost:8000/auth/google/callback` in Google Cloud Console |
| `CORS error in console` | Frontend port not allowed | Ensure `http://localhost:5173` is in CORS allow_origins in main.py |
| `Failed to get user info from Google` | Invalid access token | Check token exchange was successful (error handling will show) |
| Blank page after Google login | Callback route not working | Check backend is running and `/auth/google/callback` is accessible |

## Important Notes

- **Keep .env Secret**: Never commit `.env` with real credentials to git
- **Local Development**: REDIRECT_URI uses `http://localhost:8000` - you'll need different URIs for production
- **Token Expiry**: The JWT token expires after some time - implement token refresh if needed
- **Security**: In production, use HTTPS and environment variables from your hosting platform

## Next Steps (Optional Improvements)

1. **Add Token Refresh**: Implement endpoint to refresh expired JWT tokens
2. **Production Setup**: Use environment variables and HTTPS for production
3. **Social Login UI**: Consider adding more providers (GitHub, Microsoft, etc.)
4. **User Verification**: Add email verification for traditional signup

## Files Modified

1. `/backend/auth/google.py` - Simplified and fixed OAuth implementation
2. `/backend/main.py` - Removed conflicting OAuth imports, updated CORS
3. `/frontend/src/pages/Login.tsx` - Added Google login button

---

If you still encounter issues, check:
1. Backend logs for detailed error messages
2. Browser console (F12) for CORS or network errors
3. Google Cloud Console to verify credentials and redirect URIs are correct
