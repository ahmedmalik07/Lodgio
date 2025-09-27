#!/usr/bin/env python3
"""
Upload roommate profiles and housing listings to Supabase with vector embeddings.
Run this script after creating the tables in Supabase.

Usage:
    python upload_to_supabase.py
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from utils.supabase_setup import RoommateVectorDB


def main():
    """Upload all datasets to Supabase with progress tracking."""
    
    print("🏠 Roommate Matching System - Supabase Upload")
    print("=" * 50)
    
    # Initialize the vector database
    try:
        db = RoommateVectorDB()
        print("✅ Connected to Supabase successfully")
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check your environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)")
        print("2. Ensure the SQL tables are created in Supabase")
        print("3. Verify your internet connection")
        return 1
    
    # Define dataset paths
    datasets_dir = project_root / "datasets"
    roommate_file = datasets_dir / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
    housing_file = datasets_dir / "housing_listings_pakistan_400.json"
    
    # Check if files exist
    if not roommate_file.exists():
        print(f"❌ Roommate profiles file not found: {roommate_file}")
        return 1
    
    if not housing_file.exists():
        print(f"❌ Housing listings file not found: {housing_file}")
        return 1
    
    print(f"📂 Found datasets:")
    print(f"   • Roommate profiles: {roommate_file}")
    print(f"   • Housing listings: {housing_file}")
    print()
    
    try:
        # Upload roommate profiles
        print("🔄 Uploading roommate profiles...")
        result1 = db.upload_roommate_profiles(str(roommate_file))
        
        if result1['success']:
            print(f"✅ Uploaded {result1['count']} roommate profiles successfully")
            print(f"   • Processing time: {result1.get('processing_time', 'N/A'):.2f}s")
        else:
            print(f"❌ Failed to upload roommate profiles: {result1.get('error', 'Unknown error')}")
            return 1
        
        print()
        
        # Upload housing listings
        print("🔄 Uploading housing listings...")
        result2 = db.upload_housing_listings(str(housing_file))
        
        if result2['success']:
            print(f"✅ Uploaded {result2['count']} housing listings successfully")
            print(f"   • Processing time: {result2.get('processing_time', 'N/A'):.2f}s")
        else:
            print(f"❌ Failed to upload housing listings: {result2.get('error', 'Unknown error')}")
            return 1
        
        print()
        print("🎉 All datasets uploaded successfully!")
        print("=" * 50)
        
        # Test semantic search
        print("🧪 Testing semantic search...")
        test_query = "quiet student looking for roommate in Islamabad"
        results = db.semantic_search_profiles(test_query, limit=3)
        
        if results:
            print(f"✅ Semantic search working! Found {len(results)} matches for: '{test_query}'")
            for i, match in enumerate(results[:2], 1):
                profile = match['profile']
                similarity = match['similarity']
                print(f"   {i}. {profile.get('role', 'N/A')} in {profile.get('area', 'N/A')} (similarity: {similarity:.3f})")
        else:
            print("⚠️  Semantic search returned no results")
        
        print()
        print("📊 Database Summary:")
        
        # Get database stats
        stats = db.get_database_stats()
        if stats:
            print(f"   • Total roommate profiles: {stats.get('roommate_count', 0)}")
            print(f"   • Total housing listings: {stats.get('housing_count', 0)}")
            print(f"   • Seekers: {stats.get('seeker_count', 0)}")
            print(f"   • Providers: {stats.get('provider_count', 0)}")
        
        print()
        print("🚀 Your vector database is ready!")
        print("   You can now run the roommate matching agents with enhanced semantic search.")
        
        return 0
        
    except Exception as e:
        print(f"❌ Unexpected error during upload: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ This script requires Python 3.8 or higher")
        sys.exit(1)
    
    # Run the upload
    exit_code = main()
    sys.exit(exit_code)
