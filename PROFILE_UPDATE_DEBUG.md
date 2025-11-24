# Profile Update 500 Error - Debugging Guide

## Current Status
- ✅ Backend running locally on port 5000
- ✅ MongoDB connected successfully
- ❌ Profile update failing with 500 error on production (Render)

## What We've Fixed So Far
1. ✅ CORS configuration for multiple origins
2. ✅ Password handling (only update when provided)
3. ✅ Added detailed logging to backend
4. ✅ Frontend only sends password if not empty
5. ✅ Cloudinary URLs use HTTPS

## Possible Causes of 500 Error

### 1. **Environment Variables Missing on Render**
Check that these are set on Render:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL (no trailing slash)
- `PORT` - Auto-set by Render

### 2. **Database Connection Issue**
- MongoDB might not be accessible from Render
- Check MongoDB Atlas network access settings
- Ensure Render's IP is whitelisted (or allow from anywhere: 0.0.0.0/0)

### 3. **JWT Token Issue**
- Token might be expired
- JWT_SECRET might be different between local and production
- Try logging out and logging back in

### 4. **Mongoose Schema Validation**
- The user model might have validation rules that are failing
- Check if required fields are missing

### 5. **Password Hashing Issue**
- The pre-save hook might be causing issues
- Even though we check for password, the hook might still run

## How to Debug

### Step 1: Check Render Logs
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Click on "Logs" tab
4. Try updating your profile
5. Look for these log messages:
   ```
   Profile update request received: { userId: ..., hasName: true, hasPic: true, hasPassword: false }
   User found, updating fields...
   Saving user...
   User saved successfully
   ```
6. If you see an error, note the exact error message

### Step 2: Check Environment Variables
1. In Render dashboard, go to your service
2. Click on "Environment" tab
3. Verify all variables are set correctly
4. Make sure `JWT_SECRET` matches what you used during signup

### Step 3: Test Locally
1. Backend is running on http://localhost:5000
2. Update your `.env` in client to use local backend:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```
3. Try updating profile locally
4. Check terminal logs for detailed error

### Step 4: Check MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Click on "Network Access"
3. Make sure "0.0.0.0/0" is in the IP whitelist (for testing)
4. Or add Render's IP addresses

### Step 5: Verify JWT Token
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Check "userInfo" - copy the token
4. Go to https://jwt.io
5. Paste the token and verify it's valid
6. Check if it's expired

## Quick Fixes to Try

### Fix 1: Clear and Re-login
```javascript
// In browser console
localStorage.clear();
// Then login again
```

### Fix 2: Update MongoDB Network Access
1. MongoDB Atlas > Network Access
2. Add IP: 0.0.0.0/0 (allows all IPs - for testing only)
3. Wait 2-3 minutes for changes to apply

### Fix 3: Verify Render Environment Variables
Make sure JWT_SECRET on Render matches the one used during user registration

### Fix 4: Check Render Deployment
1. Make sure latest deployment is "Live"
2. Check build logs for any errors
3. Restart the service if needed

## Expected Log Output (Success)
```
Profile update request received: { userId: '...', hasName: true, hasPic: true, hasPassword: false }
User found, updating fields...
Saving user...
User saved successfully
```

## Expected Log Output (Error)
```
Profile update request received: { userId: '...', hasName: true, hasPic: true, hasPassword: false }
User found, updating fields...
Saving user...
Profile update error: [ERROR MESSAGE HERE]
```

## Next Steps
1. Check Render logs and share the error message
2. Verify environment variables on Render
3. Test locally to isolate the issue
4. Check MongoDB Atlas network access

## Contact Points
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- JWT Decoder: https://jwt.io
