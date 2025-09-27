#!/usr/bin/env python3

import os
import sys
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
    
    def setup_supabase_tables():
        """Set up Supabase tables and verify connection."""
        print("🔄 Setting up Supabase for RoomMate Matcher...")
        print("=" * 50)
        
        try:
            # Check environment variables
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_ANON_KEY")
            
            if not supabase_url or not supabase_key:
                print("❌ Missing Supabase credentials!")
                print("Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file")
                return False
            
            print(f"🔗 Connecting to Supabase: {supabase_url}")
            
            # Initialize RoomMate Vector DB
            db = RoommateVectorDB()
            print("✅ Successfully connected to Supabase")
            
            # Check if tables exist
            print("🔍 Checking table structure...")
            tables_exist = db.check_tables_exist()
            
            if tables_exist:
                print("✅ All required tables exist and are accessible")
                
                # Test table access
                print("🧪 Testing table operations...")
                
                # Test housing_listings table
                try:
                    housing_count = db.supabase.table('housing_listings').select('id', count='exact').execute()
                    print(f"📊 Housing listings table: {housing_count.count} records")
                except Exception as e:
                    print(f"⚠️  Housing table test failed: {e}")
                
                # Test roommate_profiles table  
                try:
                    profiles_count = db.supabase.table('roommate_profiles').select('id', count='exact').execute()
                    print(f"👥 Roommate profiles table: {profiles_count.count} records")
                except Exception as e:
                    print(f"⚠️  Profiles table test failed: {e}")
                    
                return True
                
            else:
                print("❌ Required tables don't exist!")
                print("\n📋 To create tables:")
                print("1. Go to your Supabase dashboard: https://supabase.com/dashboard")
                print("2. Navigate to SQL Editor")
                print("3. Run the SQL commands from: create_supabase_tables.sql")
                print("\nOr create them automatically:")
                
                # Option to create tables automatically
                create_tables = input("Create tables automatically? (y/n): ").lower().strip()
                
                if create_tables == 'y':
                    return create_tables_automatically(db)
                
                return False
                
        except Exception as e:
            print(f"❌ Setup failed: {str(e)}")
            return False
    
    def create_tables_automatically(db):
        """Create tables automatically using SQL commands."""
        try:
            print("🔄 Creating tables automatically...")
            
            # Read SQL commands from file
            sql_file = project_root / "create_supabase_tables.sql"
            
            if not sql_file.exists():
                print(f"❌ SQL file not found: {sql_file}")
                return False
            
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql_commands = f.read()
            
            # Split into individual commands and execute
            commands = [cmd.strip() for cmd in sql_commands.split(';') if cmd.strip()]
            
            for i, command in enumerate(commands):
                if command.upper().startswith(('CREATE', 'DROP', 'ALTER')):
                    try:
                        db.supabase.rpc('exec_sql', {'sql': command}).execute()
                        print(f"✅ Executed command {i+1}/{len(commands)}")
                    except Exception as e:
                        print(f"⚠️  Command {i+1} failed: {e}")
            
            print("✅ Tables created successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Automatic table creation failed: {e}")
            print("Please create tables manually using Supabase dashboard")
            return False
    
    def test_data_upload():
        """Test uploading a sample listing to verify everything works."""
        try:
            print("\n🧪 Testing data upload...")
            
            db = RoommateVectorDB()
            
            # Create test listing
            test_listing = {
                'id': 'TEST-LISTING-001',
                'city': 'Lahore',
                'area': 'DHA Phase 5',
                'monthly_rent_pkr': 25000,
                'rooms_available': 2,
                'availability': 'Available',
                'amenities': ['WiFi', 'AC', 'Parking', 'Security'],
                'metadata': {
                    'contact_name': 'Test User',
                    'contact_number': '+92-300-1234567',
                    'house_rules': 'No smoking, No pets',
                    'additional_info': 'Test listing for Supabase integration'
                }
            }
            
            # Upload test listing
            result = db.upload_housing(test_listing)
            
            if result['success']:
                print("✅ Test upload successful!")
                print(f"📋 Uploaded listing ID: {result['id']}")
                
                # Clean up test data
                try:
                    db.supabase.table('housing_listings').delete().eq('id', 'TEST-LISTING-001').execute()
                    print("🧹 Test data cleaned up")
                except:
                    pass
                    
                return True
            else:
                print(f"❌ Test upload failed: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ Test upload error: {str(e)}")
            return False
    
    if __name__ == "__main__":
        print("🏠 RoomMate Matcher - Supabase Setup")
        print("=" * 60)
        
        # Run setup
        setup_success = setup_supabase_tables()
        
        if setup_success:
            # Test data upload
            test_success = test_data_upload()
            
            if test_success:
                print("\n" + "=" * 60)
                print("🎉 SUPABASE SETUP COMPLETE!")
                print("✅ Your backend is now configured to save data to:")
                print("   - Local JSON files (immediate backup)")
                print("   - Supabase database (cloud storage with search)")
                print("\n🚀 You can now:")
                print("   1. Submit property listings via your frontend")
                print("   2. Data will be saved to both local and Supabase")
                print("   3. Use semantic search and matching features")
                print("=" * 60)
            else:
                print("\n❌ Setup completed but data upload test failed")
                print("Check your Supabase permissions and table structure")
        else:
            print("\n❌ Supabase setup failed")
            print("Please check your credentials and table configuration")

except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please install required dependencies:")
    print("pip install supabase sentence-transformers python-dotenv")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
