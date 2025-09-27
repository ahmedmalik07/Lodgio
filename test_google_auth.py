#!/usr/bin/env python3

import requests
import webbrowser
import time


def test_google_auth_flow():
    """Test the complete Google authentication flow"""
    
    print("🧪 Testing Google OAuth Authentication Flow")
    print("=" * 60)
    
    # Test 1: Check if API server is running
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print("✅ API Server: Running")
    except requests.exceptions.ConnectionError:
        print("❌ API Server: Not running")
        print("🔧 Start it with: cd frontend && python api_server.py")
        return False
    except Exception as e:
        print(f"❌ API Server: Error - {e}")
        return False
    
    # Test 2: Check if frontend is running  
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        print("✅ Frontend: Running")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend: Not running")
        print("🔧 Start it with: npm run dev")
        return False
    except Exception as e:
        print(f"❌ Frontend: Error - {e}")
        return False
    
    # Test 3: Check Supabase connection
    try:
        response = requests.post("http://localhost:8000/auth/google/signin",
                                json={"redirect_url": "http://localhost:3000/auth/callback"},
                                timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success' and 'auth_url' in data:
                print("✅ Supabase OAuth: Connected")
                
                # Test 4: Open authentication URL
                auth_url = data['auth_url']
                print(f"🔗 Google Auth URL: {auth_url[:50]}...")
                
                user_input = input("\\n🚀 Open Google sign-in in browser? (y/n): ").lower().strip()
                
                if user_input == 'y':
                    print("🌐 Opening Google authentication...")
                    webbrowser.open(auth_url)
                    print("\\n📋 Follow these steps:")
                    print("1. Complete Google sign-in in the opened browser")
                    print("2. You should be redirected to your app")
                    print("3. Check if you land on the dashboard")
                    print("4. Verify your profile shows up correctly")
                    
                    return True
                else:
                    print(f"\\n🔗 Manual test: Open this URL in browser:")
                    print(f"   {auth_url}")
                    return True
            else:
                print("❌ Supabase OAuth: Invalid response")
                print(f"Response: {data}")
                return False
        else:
            print(f"❌ Supabase OAuth: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Supabase OAuth: Error - {e}")
        return False


def check_environment():
    """Check if environment is properly configured"""
    print("🔍 Checking Environment Configuration")
    print("-" * 40)
    
    # Check .env file
    try:
        with open('.env', 'r') as f:
            env_content = f.read()
        
        if 'GOOGLE_CLIENT_ID=' in env_content and len(env_content.split('GOOGLE_CLIENT_ID=')[1].split('\\n')[0]) > 10:
            print("✅ Google Client ID: Configured")
        else:
            print("❌ Google Client ID: Missing or invalid")
            
        if 'GOOGLE_CLIENT_SECRET=' in env_content and 'GOCSPX-' in env_content:
            print("✅ Google Client Secret: Configured")  
        else:
            print("❌ Google Client Secret: Missing or invalid")
            
        if 'SUPABASE_URL=' in env_content and 'supabase.co' in env_content:
            print("✅ Supabase URL: Configured")
        else:
            print("❌ Supabase URL: Missing or invalid")
            
        if 'SUPABASE_ANON_KEY=' in env_content and len(env_content.split('SUPABASE_ANON_KEY=')[1].split('\\n')[0]) > 50:
            print("✅ Supabase Anon Key: Configured")
        else:
            print("❌ Supabase Anon Key: Missing or invalid")
            
        return True
        
    except FileNotFoundError:
        print("❌ .env file not found")
        return False


if __name__ == "__main__":
    print("🏠 RoomMate Matcher - Google OAuth Test")
    print("=" * 70)
    
    # Check environment first
    env_ok = check_environment()
    
    if env_ok:
        print("\\n" + "=" * 70)
        # Test authentication flow
        success = test_google_auth_flow()
        
        if success:
            print("\\n" + "=" * 70)
            print("🎉 AUTHENTICATION TEST READY!")
            print("✅ All systems are go for Google OAuth")
            print("\\n📋 Manual Testing Checklist:")
            print("□ Complete Google sign-in flow")
            print("□ Check redirect to dashboard") 
            print("□ Verify user profile data")
            print("□ Test sign-out functionality")
            print("□ Try signing in again")
            print("=" * 70)
        else:
            print("\\n❌ Authentication test failed")
            print("🔧 Please check the error messages above")
    else:
        print("\\n❌ Environment configuration incomplete")
        print("🔧 Please check your .env file")
