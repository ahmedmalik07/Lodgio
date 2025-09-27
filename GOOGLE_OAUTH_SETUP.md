# Google OAuth Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your RoomMate Matcher application.

## 🚀 **Complete Google OAuth Integration**

Your application now supports:

- ✅ **Google Sign In** - Existing users can sign in with Google
- ✅ **Google Sign Up** - New users can create accounts with Google
- ✅ **User Profiles** - Automatic profile creation with Google data
- ✅ **Protected Routes** - Dashboard and user-specific features
- ✅ **Session Management** - Secure token handling

## 📋 **Setup Steps**

### **Step 1: Google Cloud Console Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**:

   - Create a new project or select existing one
   - Name: "RoomMate Matcher" (or your preferred name)

3. **Enable Google+ API**:

   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web Application"
   - Name: "RoomMate Matcher Web Client"

5. **Configure OAuth Settings**:

   ```
   Authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:8000
   - https://yourdomain.com (for production)

   Authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://yourdomain.com/auth/callback (for production)
   ```

6. **Download Credentials**:
   - Copy **Client ID** and **Client Secret**
   - Add them to your `.env` file

### **Step 2: Supabase Configuration**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to Authentication**:

   - Go to your project → "Authentication" → "Providers"
   - Find "Google" provider
   - Enable it

3. **Configure Google Provider**:

   ```
   Client ID: [Your Google Client ID]
   Client Secret: [Your Google Client Secret]
   ```

4. **Set Redirect URLs**:

   ```
   Site URL: http://localhost:3000
   Redirect URLs:
   - http://localhost:3000/auth/callback
   - https://yourdomain.com/auth/callback
   ```

5. **Run SQL Commands**:
   - Go to "SQL Editor"
   - Run the commands from `create_auth_tables.sql`

### **Step 3: Update Environment Variables**

Update your `.env` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### **Step 4: Test the Integration**

1. **Start Your Servers**:

   ```bash
   # Backend API
   cd frontend && python api_server.py

   # Frontend
   npm run dev
   ```

2. **Test Authentication**:
   - Visit: http://localhost:3000
   - Try "Sign Up with Google"
   - Try "Sign In with Google"
   - Check dashboard: http://localhost:3000/dashboard

## 🛠️ **API Endpoints**

Your backend now includes these auth endpoints:

- **`POST /auth/google/signup`** - Initialize Google sign up
- **`POST /auth/google/signin`** - Initialize Google sign in
- **`POST /auth/callback`** - Handle OAuth callback
- **`GET /auth/user`** - Get current user info
- **`POST /auth/signout`** - Sign out user

## 🎯 **Frontend Components**

New React components available:

- **`AuthProvider`** - Context provider for auth state
- **`GoogleSignInButton`** - Sign in button component
- **`GoogleSignUpButton`** - Sign up button component
- **`UserProfile`** - Display user info
- **`AuthModal`** - Authentication modal

## 🔐 **Security Features**

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **JWT Token Validation** - Secure API authentication
- ✅ **Automatic Profile Creation** - User profiles created on first login
- ✅ **Protected Routes** - Dashboard requires authentication
- ✅ **Session Management** - Tokens stored securely in localStorage

## 📱 **Usage Example**

```tsx
import { AuthProvider, GoogleSignInButton } from './components/GoogleAuth';

export default function App() {
  return (
    <AuthProvider>
      <div>
        <GoogleSignInButton />
        {/* Your app content */}
      </div>
    </AuthProvider>
  );
}
```

## 🧪 **Testing**

Test your authentication:

1. **Sign Up Flow**:

   - Click "Sign Up with Google"
   - Complete Google OAuth
   - Should redirect to dashboard
   - Profile should be created in database

2. **Sign In Flow**:

   - Sign out and try "Sign In with Google"
   - Should authenticate existing user
   - Access dashboard and user features

3. **Protected Routes**:
   - Try accessing `/dashboard` without auth
   - Should redirect to home page
   - Sign in and access should work

## 🔍 **Troubleshooting**

**Common Issues:**

1. **"Invalid Client" Error**:

   - Check Google Client ID in Supabase settings
   - Verify redirect URLs match exactly

2. **"Access Blocked" Error**:

   - Add your domain to Google Console authorized origins
   - Check OAuth consent screen settings

3. **Database Errors**:

   - Run `create_auth_tables.sql` in Supabase
   - Check table permissions and RLS policies

4. **Token Issues**:
   - Clear localStorage and try again
   - Check network tab for API errors

## 🎉 **Next Steps**

With Google OAuth set up, you can now:

1. **Enhance User Profiles** - Add more user information
2. **Social Features** - Friend connections, messaging
3. **Advanced Matching** - Use user preferences for better matches
4. **Analytics** - Track user behavior and engagement
5. **Mobile App** - Extend to React Native with same backend

Your RoomMate Matcher now has enterprise-level authentication! 🚀
