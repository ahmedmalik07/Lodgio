#!/usr/bin/env python3

import requests
import json
import time


def test_property_save_with_supabase():
    """Test saving a property through the API server to verify Supabase integration."""
    
    print("🧪 Testing Property Save with Supabase Integration")
    print("=" * 60)
    
    # Test property data
    test_property = {
        "name": "Supabase Test User",
        "city": "Karachi",
        "area": "Clifton",
        "monthly_rent": 35000,
        "property_type": "Apartment",
        "contact_number": "+92-300-1111111",
        "rooms_available": 2,
        "amenities": "WiFi, AC, Parking, Security, Gym",
        "house_rules": "No smoking, No loud music after 10 PM",
        "additional_info": "Near beach, quiet neighborhood, family-friendly"
    }
    
    try:
        print(f"📤 Sending request to API server...")
        print(f"🏠 Property: {test_property['area']}, {test_property['city']}")
        print(f"💰 Rent: PKR {test_property['monthly_rent']:,}/month")
        
        # Make API request
        response = requests.post(
            "http://localhost:8000/list-property",
            json=test_property,
            timeout=15  # Longer timeout for Supabase operations
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print("\\n✅ API Response: SUCCESS")
            print(f"📋 Listing ID: {result.get('listing_id')}")
            
            # Check detailed storage information
            storage_details = result.get('storage_details', {})
            
            # Local storage
            local_info = storage_details.get('local_json', {})
            print(f"\\n💾 Local Storage: {'✅ SAVED' if local_info.get('saved') else '❌ FAILED'}")
            if local_info.get('saved'):
                print(f"   📁 File: {local_info.get('file_path', 'Unknown')}")
                print(f"   📊 Total listings: {local_info.get('total_listings', 0)}")
            
            # Supabase storage
            supabase_info = storage_details.get('supabase', {})
            print(f"\\n☁️  Supabase: {'✅ SAVED' if supabase_info.get('saved') else '❌ FAILED'}")
            print(f"   🔗 Status: {supabase_info.get('status', 'Unknown')}")
            
            # Overall success
            if local_info.get('saved') and supabase_info.get('saved'):
                print("\\n" + "=" * 60)
                print("🎉 SUCCESS! Data saved to BOTH local and Supabase!")
                print("✅ Your property listing is now:")
                print("   📁 Saved locally for immediate backup")
                print("   ☁️  Stored in Supabase for cloud access and search")
                print("   🔍 Available for semantic matching and queries")
                return True
            elif local_info.get('saved'):
                print("\\n⚠️  Partial Success: Local storage works but Supabase failed")
                print("Check Supabase credentials and table setup")
                return False
            else:
                print("\\n❌ Both storage methods failed!")
                return False
                
        else:
            print(f"\\n❌ API Error: HTTP {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Response text: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\\n❌ Connection Error!")
        print("🔧 Make sure the API server is running:")
        print("   cd frontend && python api_server.py")
        return False
    except requests.exceptions.Timeout:
        print("\\n❌ Request Timeout!")
        print("The server might be processing heavy ML operations...")
        return False
    except Exception as e:
        print(f"\\n❌ Unexpected error: {str(e)}")
        return False


def verify_saved_data():
    """Check the saved data via API endpoint."""
    try:
        print("\\n🔍 Verifying saved data...")
        
        response = requests.get("http://localhost:8000/view-user-listings", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            listings = result.get('listings', [])
            
            print(f"📊 Total listings found: {len(listings)}")
            
            if listings:
                latest = listings[-1]
                print(f"🔄 Latest listing:")
                print(f"   ID: {latest.get('listing_id')}")
                print(f"   Location: {latest.get('city')}, {latest.get('area')}")
                print(f"   Rent: PKR {latest.get('monthly_rent_PKR', 0):,}")
                print(f"   Created: {latest.get('created_at')}")
                return True
            else:
                print("ℹ️  No listings found")
                return False
        else:
            print(f"❌ Could not retrieve listings: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking saved data: {e}")
        return False


if __name__ == "__main__":
    print("🏠 RoomMate Matcher - End-to-End Supabase Test")
    print("=" * 70)
    
    # Run the test
    success = test_property_save_with_supabase()
    
    if success:
        # Verify the saved data
        verify_success = verify_saved_data()
        
        if verify_success:
            print("\\n" + "=" * 70)
            print("🚀 COMPLETE SUCCESS!")
            print("Your system is now saving data to:")
            print("✅ Local JSON files (immediate access)")
            print("✅ Supabase database (cloud storage)")
            print("🔍 Ready for semantic search and matching")
            print("=" * 70)
        else:
            print("\\n⚠️  Save successful but verification failed")
    else:
        print("\\n" + "=" * 70)
        print("❌ TEST FAILED")
        print("🔧 Troubleshooting steps:")
        print("1. Make sure API server is running: python frontend/api_server.py")
        print("2. Check Supabase credentials in .env file")
        print("3. Verify Supabase tables exist (run SQL from create_supabase_tables.sql)")
        print("4. Check server console for detailed error messages")
        print("=" * 70)
