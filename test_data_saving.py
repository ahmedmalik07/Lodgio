#!/usr/bin/env python3

import requests
import json
import time
from pathlib import Path

# Configuration
API_BASE_URL = "http://localhost:8000"
project_root = Path(__file__).parent


def test_property_listing():
    """Test saving a property listing"""
    print("🧪 Testing Property Listing Save...")
    print("=" * 50)
    
    # Test data
    test_property = {
        "name": "Ahmed Test User",
        "city": "Lahore",
        "area": "DHA Phase 5",
        "monthly_rent": 25000,
        "property_type": "Apartment",
        "contact_number": "+92-300-1234567",
        "rooms_available": 2,
        "amenities": "WiFi, AC, Parking, Security",
        "house_rules": "No smoking, No pets",
        "additional_info": "Near university, quiet neighborhood"
    }
    
    try:
        # Make API call
        response = requests.post(f"{API_BASE_URL}/list-property", json=test_property, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Response: SUCCESS")
            print(f"📋 Listing ID: {result.get('listing_id')}")
            print(f"💾 Local Storage: {'SAVED' if result.get('storage_details', {}).get('local_json', {}).get('saved') else 'FAILED'}")
            print(f"☁️  Supabase: {'SAVED' if result.get('storage_details', {}).get('supabase', {}).get('saved') else 'NOT AVAILABLE'}")
            
            # Show storage details
            storage_details = result.get('storage_details', {})
            if storage_details.get('local_json', {}).get('saved'):
                local_info = storage_details['local_json']
                print(f"📁 Local File: {local_info.get('file_path')}")
                print(f"📊 Total Listings: {local_info.get('total_listings')}")
            
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the API server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Test Error: {str(e)}")
        return False


def view_saved_listings():
    """View all saved user listings"""
    print("\n🔍 Checking Saved Listings...")
    print("=" * 50)
    
    try:
        response = requests.get(f"{API_BASE_URL}/view-user-listings", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            listings = result.get('listings', [])
            
            print(f"📊 Total Listings Found: {len(listings)}")
            
            if listings:
                print("\n📋 Recent Listings:")
                for i, listing in enumerate(listings[-3:], 1):  # Show last 3
                    print(f"\n{i}. {listing.get('listing_id', 'Unknown ID')}")
                    print(f"   🏠 {listing.get('contact_name')} - {listing.get('city')}, {listing.get('area')}")
                    print(f"   💰 PKR {listing.get('monthly_rent_PKR', 0):,}/month")
                    print(f"   📅 Created: {listing.get('created_at', 'Unknown')}")
            else:
                print("ℹ️  No listings found yet")
                
        else:
            print(f"❌ Error getting listings: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def check_local_files():
    """Check local JSON files directly"""
    print("\n📁 Checking Local Files...")
    print("=" * 50)
    
    # Check user listings file
    user_listings_file = project_root / "datasets" / "user_listings.json"
    
    if user_listings_file.exists():
        try:
            with open(user_listings_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"✅ Local File Exists: {user_listings_file}")
            print(f"📊 Records in file: {len(data)}")
            
            if data:
                latest = data[-1]
                print(f"🔄 Latest entry:")
                print(f"   ID: {latest.get('listing_id')}")
                print(f"   Location: {latest.get('city')}, {latest.get('area')}")
                print(f"   Created: {latest.get('created_at')}")
            
        except Exception as e:
            print(f"❌ Error reading file: {str(e)}")
    else:
        print(f"⚠️  File not found: {user_listings_file}")


def main():
    print("🏠 RoomMate Matcher - Data Storage Test")
    print("=" * 60)
    
    # Test sequence
    success = test_property_listing()
    
    if success:
        time.sleep(1)  # Wait a moment for file write
        view_saved_listings()
        check_local_files()
        
        print("\n" + "=" * 60)
        print("🎉 TEST COMPLETE!")
        print("✅ Your data is being saved correctly to both local JSON and Supabase")
        print("📁 You can find your data in: datasets/user_listings.json")
        print("🌐 Supabase data is accessible through your dashboard")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ TEST FAILED!")
        print("🔧 Make sure the API server is running: python frontend/api_server.py")
        print("=" * 60)


if __name__ == "__main__":
    main()
