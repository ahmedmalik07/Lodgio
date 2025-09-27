#!/usr/bin/env python3

import os
import json
from pathlib import Path
import sys

# Add project root to path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from dotenv import load_dotenv
load_dotenv()

print("🚀 Quick Profile Upload to Fix Hallucination")
print("=" * 50)

# Test Supabase connection first
try:
    from supabase import create_client
    
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')
    
    print(f"🔗 Connecting to Supabase: {SUPABASE_URL[:50]}...")
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase connection successful!")
    
    # Test a simple query
    print("📋 Testing database connection...")
    try:
        result = supabase.table('roommate_profiles').select('count').execute()
        current_count = len(result.data) if result.data else 0
        print(f"📊 Current profiles in database: {current_count}")
    except Exception as e:
        print(f"⚠️  Database query failed: {e}")
        print("🔧 This is normal if tables don't exist yet")
    
    # Load and check profile data
    profiles_file = project_root / "datasets" / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
    
    if profiles_file.exists():
        print(f"📁 Loading profiles from: {profiles_file.name}")
        
        with open(profiles_file, 'r', encoding='utf-8') as f:
            profiles = json.load(f)
        
        print(f"📈 Found {len(profiles)} profiles to upload")
        
        # Show sample profile to verify
        if profiles:
            sample = profiles[0]
            print(f"📝 Sample profile: {sample.get('id', 'No ID')} - {sample.get('raw_profile_text', 'No text')[:100]}...")
            
            # Look specifically for R-156 to verify
            r156 = next((p for p in profiles if p.get('id') == 'R-156'), None)
            if r156:
                print(f"✅ Found R-156: {r156.get('raw_profile_text', 'No text')[:100]}...")
            else:
                print("❌ R-156 not found in profiles!")
        
        print(f"\n🎯 Ready to upload {len(profiles)} profiles to fix hallucination!")
        print("   This will replace fake profiles like 'Ahmad Khan Computer Science student'")
        print("   with real profiles from your dataset.")
        
        proceed = input("\n📤 Proceed with upload? (y/n): ").lower().strip()
        
        if proceed == 'y':
            print("🔄 Starting upload...")
            
            # Simple batch upload
            try:
                batch_size = 50
                uploaded = 0
                
                for i in range(0, len(profiles), batch_size):
                    batch = profiles[i:i + batch_size]
                    
                    # Prepare batch for Supabase
                    supabase_batch = []
                    for profile in batch:
                        supabase_profile = {
                            'id': profile['id'],
                            'role': profile.get('role', 'seeker'),
                            'city': profile.get('city', ''),
                            'area': profile.get('area', ''),
                            'budget_pkr': profile.get('budget_PKR', 0),
                            'sleep_schedule': profile.get('sleep_schedule', ''),
                            'cleanliness': profile.get('cleanliness', ''),
                            'noise_tolerance': profile.get('noise_tolerance', ''),
                            'study_habits': profile.get('study_habits', ''),
                            'food_pref': profile.get('food_pref', ''),
                            'raw_text': profile.get('raw_profile_text', ''),
                            'metadata': profile
                        }
                        supabase_batch.append(supabase_profile)
                    
                    # Upload batch
                    result = supabase.table('roommate_profiles').upsert(supabase_batch).execute()
                    uploaded += len(batch)
                    
                    print(f"✅ Uploaded batch {(i//batch_size)+1} - Total: {uploaded}/{len(profiles)}")
                
                print(f"🎉 Successfully uploaded {uploaded} profiles!")
                print("🔧 Agent should now use real data instead of hallucinating!")
                
            except Exception as e:
                print(f"❌ Upload failed: {e}")
        else:
            print("❌ Upload cancelled")
    
    else:
        print(f"❌ Profiles file not found: {profiles_file}")

except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n🏁 Done!")
