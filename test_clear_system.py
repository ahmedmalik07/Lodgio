#!/usr/bin/env python3
"""
Test the fixed roommate matching system with clear thought processes.
This test will show exactly what's happening at each step.
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from google.adk import create_session
from agents.clear_roommate_matcher.agent import clear_roommate_matcher


def test_kamra_query():
    """Test the system with a Kamra query to see how it handles missing locations."""
    
    print("🧪 TESTING CLEAR ROOMMATE MATCHING SYSTEM")
    print("=" * 60)
    print("Query: 'room mate in kamra near air university, male and studious'")
    print("Expected: System should recognize Kamra is not in dataset and handle gracefully")
    print()
    
    # Test query
    query = "room mate in kamra near air university, male and studious"
    
    try:
        # Create session and run
        session = create_session()
        result = session.run(
            agent=clear_roommate_matcher,
            user_input=query
        )
        
        print("📋 SYSTEM OUTPUT:")
        print("=" * 30)
        print(result)
        
        print()
        print("✅ Test completed successfully!")
        print("Check if each agent shows:")
        print("  1. Clear thought process/reasoning")
        print("  2. Proper handling of missing location (Kamra)")
        print("  3. No hallucinated profile IDs")
        print("  4. Structured, readable output")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()


def test_islamabad_query():
    """Test with a location that exists in the dataset."""
    
    print("\n\n🧪 TESTING WITH AVAILABLE LOCATION")
    print("=" * 50) 
    print("Query: 'need studious roommate in islamabad, budget 15k'")
    print("Expected: Should find actual matches from dataset")
    print()
    
    query = "need studious roommate in islamabad, budget 15k"
    
    try:
        session = create_session()
        result = session.run(
            agent=clear_roommate_matcher,
            user_input=query
        )
        
        print("📋 SYSTEM OUTPUT:")
        print("=" * 30)
        print(result)
        
        print()
        print("✅ Test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Test missing location (Kamra)
    test_kamra_query()
    
    # Test available location (Islamabad)
    test_islamabad_query()
    
    print("\n🎯 SUMMARY:")
    print("- First test shows how system handles missing locations")
    print("- Second test shows how system works with available data") 
    print("- Both should show clear agent reasoning steps")
    print("- No fake profile IDs should appear")
