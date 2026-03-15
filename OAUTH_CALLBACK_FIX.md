# Google OAuth 2.0 Callback Error - Complete Fix Guide

## The Issue You're Seeing

When you click "Sign in with Google" and enter your credentials, you get this error at the callback:
```json
{
  "error": {
    "code": 401,
    "message": "Request is missing required authentication credential...",
    "status": "UNAUTHENTICATED"
  }
}
```

This happens at the callback stage when Google redirects you back to `http://localhost:8000/auth/google/callback`.

## Root Causes

### 1. **Redirect URI Not Registered in Google Cloud Console**
The redirect URI `http://localhost:8000/auth/google/callback` must be explicitly registered in your Google OAuth application settings.

### 2. **Missing Required Dependencies**
- `httpx` - For making HTTP requests to Google's API
- `python-dotenv` - For loading .env credentials

### 3. **Callback Flow Issue**
The callback endpoint wasn't properly handling the redirect back to the frontend with the authentication token.

## Solution Steps

### Step 1: Register Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **Credentials** (left sidebar)
4. Find your OAuth 2.0 Client ID (Web application)
5. Click on it to edit
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8000/auth/google/callback
   ```
7. **Save** the changes
8. Wait 5-10 minutes for changes to propagate

### Step 2: Verify Your .env File

Your `.env` file should look like this:
```env
GOOGLE_CLIENT_ID=118333863712-5k1pmffu7tk2q7pfihkntu1nuids1an5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**Important**: 
- ✅ The complete Client ID (no truncation)
- ✅ The complete Client Secret (no angle brackets)
- ⚠️ Never commit this file to git

### Step 3: Verify Dependencies

The backend now requires:
```
python-dotenv==1.0.0
httpx==0.25.2
```

These should already be installed if you ran:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: How the Flow Works Now

```
1. User clicks "Sign in with Google" button
   ↓
2. Frontend calls http://localhost:8000/auth/google/login
   ↓
3. Backend returns Google's auth URL
   ↓
4. Frontend redirects to Google login page
   ↓
5. User logs in with Gmail and authorizes the app
   ↓
6. Google redirects browser to http://localhost:8000/auth/google/callback?code=...
   ↓
7. Backend:
   - Exchanges auth code for access token with Google
   - Uses access token to get user info from Google
   - Creates/updates user in your database
   - Generates JWT token for your app
   - Redirects user back to http://localhost:5173/dashboard?token=...
   ↓
8. Frontend AuthContext detects token in URL
   ↓
9. Frontend stores token and user in localStorage
   ↓
10. User is logged in and redirected to dashboard
```

## Testing the Complete Flow

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test OAuth Flow
1. Open http://localhost:5173
2. Click "Sign in with Google"
3. You'll see Google's login page (or be asked to select an account)
4. Grant permission
5. You should be redirected to your dashboard
6. Check browser console (F12) for any errors

## Debugging: How to Check If It's Working

### Check 1: Backend Logs
When you click the Google button, you should see:
```
INFO:     127.0.0.1:xxxxx - "GET /auth/google/login HTTP/1.1" 200
```

When Google redirects back:
```
INFO:     127.0.0.1:xxxxx - "GET /auth/google/callback?code=... HTTP/1.1" 307
```
(307 is the redirect response)

### Check 2: Network Tab (F12 Browser)
You should see these requests:
1. `GET http://localhost:8000/auth/google/login` → Returns `{"auth_url": "https://..."}`
2. `GET https://accounts.google.com/o/oauth2/v2/auth?...` → Redirects to Google
3. Google login page
4. `GET http://localhost:8000/auth/google/callback?code=...` → Returns 307 redirect
5. `GET http://localhost:5173/dashboard?token=...`

### Check 3: LocalStorage
After successful login, check browser DevTools → Application → Local Storage:
- `token`: Should contain your JWT token
- `finsight_user`: Should contain `{"id":"...", "name":"...", "email":"...", ...}`

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `redirect_uri_mismatch` | Redirect URI not registered in Google Console | Add `http://localhost:8000/auth/google/callback` to authorized URIs and wait 5-10 min |
| `invalid_grant` | Code expired or already used | Clear browser cache, try again |
| `access_denied` | User denied permission | Click "Sign in with Google" again and grant permission |
| CORS error in console | Frontend port not allowed | Ensure CORS middleware includes your frontend port |
| Blank page after Google | Callback redirect not working | Check backend logs for errors |
| 401 UNAUTHENTICATED | This specific error | Follow Step 1 above - register the redirect URI |

## Critical Checklist Before Testing

- [ ] Redirect URI `http://localhost:8000/auth/google/callback` is registered in Google Console
- [ ] `.env` file has complete, untruncated credentials
- [ ] Backend is running on `http://localhost:8000`
- [ ] Frontend is running on `http://localhost:5173` (or configured port)
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] No browser cache issues: Clear cache or use Incognito mode
- [ ] Wait 5-10 minutes after registering redirect URI in Google Console

## Files Modified

1. **`/backend/auth/google.py`**
   - Simplified to single, clean implementation
   - Added better error handling and logging
   - Callback now redirects to frontend with token

2. **`/backend/main.py`**
   - Fixed CORS to allow multiple ports
   - Removed conflicting OAuth imports

3. **`/frontend/src/contexts/AuthContext.tsx`**
   - Added OAuth callback handler
   - Extracts token from URL params
   - Stores in localStorage

4. **`/frontend/src/pages/Login.tsx`**
   - Added "Sign in with Google" button

5. **`/backend/requirements.txt`**
   - Added `python-dotenv` and `httpx`

## Production Considerations

- Use environment variables for credentials (not .env files)
- Change `localhost` to your actual domain
- Use HTTPS for all OAuth endpoints
- Implement token refresh mechanism
- Store JWT tokens securely
- Add rate limiting to auth endpoints

---

**Still having issues?** Check the backend console output for detailed error messages!
