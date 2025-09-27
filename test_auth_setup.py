#!/usr/bin/env python3

import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.append(str(project_root))


def test_supabase_auth_only():
    """Test only the Supabase authentication setup"""
    print("🔐 Testing Supabase Authentication Setup")
    print("=" * 50)
    
    try:
        from utils.supabase_setup import RoommateVectorDB
        from dotenv import load_dotenv
        
        # Load environment
        load_dotenv()
        
        # Check environment variables
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        
        print("🔍 Environment Check:")
        print(f"   Supabase URL: {'✅ Set' if supabase_url else '❌ Missing'}")
        print(f"   Supabase Key: {'✅ Set' if supabase_key else '❌ Missing'}")
        print(f"   Google Client ID: {'✅ Set' if google_client_id else '❌ Missing'}")
        print(f"   Google Secret: {'✅ Set' if google_client_secret else '❌ Missing'}")
        
        if not all([supabase_url, supabase_key, google_client_id, google_client_secret]):
            print("❌ Missing environment variables")
            return False
        
        # Test Supabase connection
        print("\n🔗 Testing Supabase Connection:")
        try:
            db = RoommateVectorDB()
            print("✅ Supabase client created successfully")
            
            # Test auth methods
            print("\n🧪 Testing Authentication Methods:")
            
            # Test Google OAuth URL generation
            try:
                result = db.sign_in_with_google("http://localhost:3000/auth/callback")
                if result['success'] and 'auth_url' in result:
                    print("✅ Google OAuth URL generation: Working")
                    print(f"   Sample URL: {result['auth_url'][:60]}...")
                else:
                    print("❌ Google OAuth URL generation: Failed")
                    print(f"   Error: {result.get('error', 'Unknown')}")
            except Exception as e:
                print(f"❌ Google OAuth test failed: {e}")
            
            return True
            
        except Exception as e:
            print(f"❌ Supabase connection failed: {e}")
            return False
            
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        print("Install dependencies: pip install supabase python-dotenv")
        return False


def test_api_endpoints():
    """Test API server authentication endpoints"""
    print("\n🌐 Testing API Server Endpoints:")
    print("-" * 40)
    
    try:
        import requests
        
        # Test health endpoint
        try:
            response = requests.get("http://localhost:8000/health", timeout=5)
            print(f"✅ Health endpoint: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("❌ API server not running")
            print("   Start with: cd frontend && python api_server.py")
            return False
        
        # Test Google sign-in endpoint
        try:
            test_data = {"redirect_url": "http://localhost:3000/auth/callback"}
            response = requests.post("http://localhost:8000/auth/google/signin",
                                   json=test_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    print("✅ Google sign-in endpoint: Working")
                    print(f"   Auth URL generated: {len(data.get('auth_url', ''))} chars")
                else:
                    print("❌ Google sign-in endpoint: Failed")
                    print(f"   Error: {data.get('error', 'Unknown')}")
            else:
                print(f"❌ Google sign-in endpoint: HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('error', response.text)}")
                except:
                    print(f"   Response: {response.text}")
            
            return response.status_code == 200
            
        except Exception as e:
            print(f"❌ Endpoint test failed: {e}")
            return False
            
    except ImportError:
        print("❌ Requests not available")
        print("   Install with: pip install requests")
        return False


if __name__ == "__main__":
    print("🏠 RoomMate Matcher - Authentication Diagnostics")
    print("=" * 70)
    
    # Test 1: Supabase setup
    supabase_ok = test_supabase_auth_only()
    
    # Test 2: API endpoints
    if supabase_ok:
        api_ok = test_api_endpoints()
        
        if api_ok:
            print("\n" + "=" * 70)
            print("🎉 AUTHENTICATION SETUP SUCCESSFUL!")
            print("✅ All systems ready for Google OAuth")
            print("\n🚀 Next Steps:")
            print("1. Make sure both servers are running:")
            print("   Backend: cd frontend && python api_server.py")
            print("   Frontend: npm run dev")
            print("2. Visit: http://localhost:3000")
            print("3. Try 'Sign Up with Google' or 'Sign In with Google'")
            print("=" * 70)
        else:
            print("\n❌ API server authentication not working")
            print("🔧 Restart the API server and try again")
    else:
        print("\n❌ Supabase authentication setup failed")
        print("🔧 Check your .env file and Supabase configuration")
