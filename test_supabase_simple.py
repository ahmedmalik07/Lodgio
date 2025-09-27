#!/usr/bin/env python3

import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv()


def test_supabase_direct():
    """Direct Supabase connection test without ML dependencies."""
    try:
        from supabase import create_client, Client
        
        # Get credentials
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            print("❌ Missing Supabase credentials in .env file")
            return False
        
        print(f"🔗 Connecting to Supabase: {supabase_url}")
        
        # Create client
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Test table access
        print("🔍 Testing table access...")
        
        # Test housing_listings table
        try:
            housing_result = supabase.table('housing_listings').select('id').limit(1).execute()
            print(f"✅ Housing listings table: Accessible ({len(housing_result.data)} test records)")
        except Exception as e:
            print(f"❌ Housing listings table error: {e}")
            return False
        
        # Test roommate_profiles table
        try:
            profiles_result = supabase.table('roommate_profiles').select('id').limit(1).execute()
            print(f"✅ Roommate profiles table: Accessible ({len(profiles_result.data)} test records)")
        except Exception as e:
            print(f"❌ Roommate profiles table error: {e}")
            return False
        
        # Test inserting a simple record (without embedding)
        print("🧪 Testing data insertion...")
        
        test_listing = {
            'id': f'TEST-{int(time.time())}',
            'city': 'Test City',
            'area': 'Test Area',
            'monthly_rent_pkr': 20000,
            'rooms_available': 1,
            'availability': 'Available',
            'amenities': ['Test', 'Amenity'],
            'metadata': {'test': True, 'created_by': 'direct_test'}
        }
        
        # Insert without embedding first
        try:
            insert_result = supabase.table('housing_listings').insert([test_listing]).execute()
            print(f"✅ Test insertion successful: {test_listing['id']}")
            
            # Clean up test data
            delete_result = supabase.table('housing_listings').delete().eq('id', test_listing['id']).execute()
            print("🧹 Test data cleaned up")
            
            return True
            
        except Exception as e:
            print(f"❌ Test insertion failed: {e}")
            return False
            
    except ImportError:
        print("❌ Supabase library not installed. Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False


def test_api_server_supabase():
    """Test the API server's Supabase integration."""
    try:
        import requests
        
        print("\n🌐 Testing API server Supabase integration...")
        
        # Test data
        test_data = {
            "name": "API Test User",
            "city": "Islamabad",
            "area": "F-7",
            "monthly_rent": 30000,
            "property_type": "Apartment",
            "contact_number": "+92-300-9876543",
            "amenities": "WiFi, AC, Parking",
            "house_rules": "No smoking",
            "additional_info": "Testing Supabase integration"
        }
        
        # Make API call
        response = requests.post("http://localhost:8000/list-property", json=test_data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            
            print("✅ API Response received")
            
            # Check storage results
            storage_details = result.get('storage_details', {})
            supabase_status = storage_details.get('supabase', {})
            
            if supabase_status.get('saved'):
                print("✅ Supabase save: SUCCESS")
                print(f"📋 Listing ID: {result.get('listing_id')}")
                return True
            else:
                print("❌ Supabase save: FAILED")
                print(f"Status: {supabase_status.get('status', 'Unknown')}")
                return False
        else:
            print(f"❌ API Error: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ API server not running. Start with: python frontend/api_server.py")
        return False
    except Exception as e:
        print(f"❌ API test error: {e}")
        return False


if __name__ == "__main__":
    print("🏠 RoomMate Matcher - Supabase Quick Test")
    print("=" * 60)
    
    # Test 1: Direct Supabase connection
    print("TEST 1: Direct Supabase Connection")
    print("-" * 40)
    direct_success = test_supabase_direct()
    
    if direct_success:
        print("\n✅ Direct Supabase connection: SUCCESS")
        
        # Test 2: API server integration
        print("\nTEST 2: API Server Integration")
        print("-" * 40)
        api_success = test_api_server_supabase()
        
        if api_success:
            print("\n" + "=" * 60)
            print("🎉 ALL TESTS PASSED!")
            print("✅ Your data is now saving to Supabase successfully")
            print("🌐 Both local JSON and cloud database are working")
            print("=" * 60)
        else:
            print("\n❌ API integration failed but Supabase connection works")
            print("Check the API server logs for more details")
    else:
        print("\n❌ Direct Supabase connection failed")
        print("Please check your credentials and table setup")
        print("\n📋 To fix:")
        print("1. Verify .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY")
        print("2. Run SQL commands from create_supabase_tables.sql in Supabase dashboard")
        print("3. Make sure tables 'housing_listings' and 'roommate_profiles' exist")
