#!/usr/bin/env python3

import os
import sys
import json
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

try:
    from utils.supabase_setup import RoommateVectorDB
    from dotenv import load_dotenv
    import logging
    
    # Load environment variables
    load_dotenv()
    
    # Configure logging
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    logger = logging.getLogger(__name__)
    
    def upload_real_data_to_supabase():
        """Upload actual roommate profiles and housing data to Supabase"""
        
        print("🚀 Uploading Real Data to Supabase")
        print("=" * 60)
        print("This will fix the hallucination issue by using actual profiles!")
        print()
        
        try:
            # Initialize Supabase connection
            print("🔗 Connecting to Supabase...")
            db = RoommateVectorDB()
            
            # Check auth connection first
            auth_ok = db.check_auth_connection()
            if not auth_ok:
                print("❌ Supabase authentication not working")
                print("🔧 Please check your credentials and run SQL commands first")
                return False
            
            print("✅ Supabase connection successful")
            
            # Create missing tables first
            print("🔧 Creating missing tables...")
            create_tables_success = create_missing_tables(db)
            if not create_tables_success:
                print("⚠️  Some tables might already exist - continuing...")
            
            # 1. Upload Roommate Profiles
            profiles_file = project_root / "datasets" / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
            
            if profiles_file.exists():
                print(f"📊 Loading roommate profiles from: {profiles_file}")
                
                with open(profiles_file, 'r', encoding='utf-8') as f:
                    profiles = json.load(f)
                
                print(f"📈 Found {len(profiles)} profiles to upload")
                
                # Upload in batches
                batch_size = 20
                uploaded_count = 0
                
                for i in range(0, len(profiles), batch_size):
                    batch = profiles[i:i + batch_size]
                    batch_num = (i // batch_size) + 1
                    total_batches = (len(profiles) + batch_size - 1) // batch_size
                    
                    try:
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
                            
                            # Add embedding if available
                            if db.embeddings_available:
                                try:
                                    embedding = db.generate_profile_embedding(profile)
                                    supabase_profile['embedding'] = embedding
                                except:
                                    pass  # Continue without embedding
                            
                            supabase_batch.append(supabase_profile)
                        
                        # Upload batch
                        result = db.supabase.table('roommate_profiles').upsert(supabase_batch).execute()
                        uploaded_count += len(batch)
                        
                        print(f"✅ Uploaded batch {batch_num}/{total_batches} ({len(batch)} profiles)")
                        
                    except Exception as e:
                        print(f"⚠️  Batch {batch_num} failed: {e}")
                        continue
                
                print(f"🎉 Successfully uploaded {uploaded_count}/{len(profiles)} profiles!")
            
            else:
                print(f"❌ Profiles file not found: {profiles_file}")
                return False
            
            # 2. Upload Housing Listings
            housing_file = project_root / "datasets" / "housing_listings_pakistan_400.json"
            
            if housing_file.exists():
                print(f"🏠 Loading housing listings from: {housing_file}")
                
                with open(housing_file, 'r', encoding='utf-8') as f:
                    listings = json.load(f)
                
                print(f"📈 Found {len(listings)} listings to upload")
                
                # Upload in batches
                uploaded_count = 0
                
                for i in range(0, len(listings), batch_size):
                    batch = listings[i:i + batch_size]
                    batch_num = (i // batch_size) + 1
                    total_batches = (len(listings) + batch_size - 1) // batch_size
                    
                    try:
                        # Prepare batch for Supabase
                        supabase_batch = []
                        for listing in batch:
                            supabase_listing = {
                                'id': listing.get('listing_id', f"H-{i+1:03d}"),
                                'city': listing.get('city', ''),
                                'area': listing.get('area', ''),
                                'monthly_rent_pkr': listing.get('monthly_rent_PKR', 0),
                                'rooms_available': listing.get('rooms_available', 1),
                                'availability': listing.get('availability', 'Available'),
                                'amenities': listing.get('amenities', []) if isinstance(listing.get('amenities'), list) else [],
                                'metadata': listing
                            }
                            
                            # Add embedding if available
                            if db.embeddings_available:
                                try:
                                    embedding = db.generate_housing_embedding(supabase_listing)
                                    supabase_listing['embedding'] = embedding
                                except:
                                    pass  # Continue without embedding
                            
                            supabase_batch.append(supabase_listing)
                        
                        # Upload batch
                        result = db.supabase.table('housing_listings').upsert(supabase_batch).execute()
                        uploaded_count += len(batch)
                        
                        print(f"✅ Uploaded batch {batch_num}/{total_batches} ({len(batch)} listings)")
                        
                    except Exception as e:
                        print(f"⚠️  Batch {batch_num} failed: {e}")
                        continue
                
                print(f"🎉 Successfully uploaded {uploaded_count}/{len(listings)} listings!")
            
            else:
                print(f"ℹ️  Housing file not found: {housing_file} (optional)")
            
            # 3. Test the data
            print("\\n🧪 Testing uploaded data...")
            test_success = test_uploaded_data(db)
            
            if test_success:
                print("\\n" + "=" * 60)
                print("🎉 SUCCESS! Real data uploaded to Supabase!")
                print("✅ Agent will now use actual profiles instead of hallucinating")
                print("🔍 Example real profiles available:")
                
                # Show some real examples
                show_real_examples(db)
                
                print("\\n🚀 Next steps:")
                print("1. Restart your API server")
                print("2. Test roommate matching - should use real data")
                print("3. No more hallucinated profiles!")
                print("=" * 60)
                return True
            else:
                print("\\n⚠️  Data uploaded but testing failed")
                return False
                
        except Exception as e:
            print(f"❌ Upload failed: {str(e)}")
            return False
    
    def create_missing_tables(db):
        """Create the missing housing_listings and roommate_profiles tables"""
        try:
            # Create roommate_profiles table
            profiles_sql = '''
            CREATE TABLE IF NOT EXISTS roommate_profiles (
              id TEXT PRIMARY KEY,
              role TEXT NOT NULL CHECK (role IN ('seeker', 'provider')),
              city TEXT,
              area TEXT,
              budget_pkr INTEGER,
              sleep_schedule TEXT,
              cleanliness TEXT,
              noise_tolerance TEXT,
              study_habits TEXT,
              food_pref TEXT,
              raw_text TEXT,
              embedding vector(384),
              metadata JSONB,
              user_id UUID REFERENCES auth.users(id),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            '''
            
            # Create housing_listings table
            housing_sql = '''
            CREATE TABLE IF NOT EXISTS housing_listings (
              id TEXT PRIMARY KEY,
              city TEXT,
              area TEXT,
              monthly_rent_pkr INTEGER,
              rooms_available INTEGER,
              availability TEXT CHECK (availability IN ('Available', 'Not Available')),
              amenities JSONB,
              embedding vector(384),
              metadata JSONB,
              user_id UUID REFERENCES auth.users(id),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            '''
            
            # Execute SQL (this might fail if tables exist, which is fine)
            try:
                db.supabase.rpc('exec_sql', {'sql': profiles_sql}).execute()
                print("✅ Created roommate_profiles table")
            except:
                print("ℹ️  roommate_profiles table already exists")
                
            try:
                db.supabase.rpc('exec_sql', {'sql': housing_sql}).execute()
                print("✅ Created housing_listings table")
            except:
                print("ℹ️  housing_listings table already exists")
            
            return True
            
        except Exception as e:
            print(f"⚠️  Table creation: {e}")
            return False
    
    def test_uploaded_data(db):
        """Test that the uploaded data is accessible"""
        try:
            # Test profiles
            profiles_result = db.supabase.table('roommate_profiles').select('id', 'city', 'role').limit(5).execute()
            profiles_count = len(profiles_result.data) if profiles_result.data else 0
            
            # Test housing
            housing_result = db.supabase.table('housing_listings').select('id', 'city').limit(5).execute()
            housing_count = len(housing_result.data) if housing_result.data else 0
            
            print(f"📊 Profiles accessible: {profiles_count}")
            print(f"🏠 Housing accessible: {housing_count}")
            
            return profiles_count > 0
            
        except Exception as e:
            print(f"❌ Data test failed: {e}")
            return False
    
    def show_real_examples(db):
        """Show examples of real profiles that are now available"""
        try:
            # Get some real profiles including R-156
            result = db.supabase.table('roommate_profiles').select('*').in_('id', ['R-001', 'R-156', 'R-200']).execute()
            
            if result.data:
                for profile in result.data:
                    print(f"\\n📋 Real Profile: {profile['id']}")
                    print(f"   Location: {profile.get('city', 'Unknown')}, {profile.get('area', 'Unknown')}")
                    print(f"   Role: {profile.get('role', 'Unknown')}")
                    print(f"   Text: {profile.get('raw_text', 'No description')[:60]}...")
            else:
                print("ℹ️  No example profiles found")
                
        except Exception as e:
            print(f"⚠️  Could not show examples: {e}")

    if __name__ == "__main__":
        print("🏠 RoomMate Matcher - Fix Hallucination Issue")
        print("=" * 70)
        print("This will upload real roommate data to Supabase to stop AI hallucination")
        print()
        
        # Confirm before proceeding
        confirm = input("Upload real data to Supabase? This will fix the hallucination issue. (y/n): ").lower().strip()
        
        if confirm == 'y':
            success = upload_real_data_to_supabase()
            
            if success:
                print("\\n🎉 Hallucination issue FIXED!")
                print("Your agents will now use real profile data instead of making things up.")
            else:
                print("\\n❌ Upload failed. Check the error messages above.")
        else:
            print("Upload cancelled.")

except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please make sure you're in the virtual environment:")
    print(".\\.venv\\Scripts\\Activate.ps1")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
