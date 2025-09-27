#!/usr/bin/env python3
"""
Quick test to verify agent outputs use real data.
"""

import json
from google.adk import create_session
from agents.roommate_matcher_root.agent import roommate_matcher_root_agent


def test_real_data():
    """Test agents with Multan query and validate outputs."""
    print("🧪 TESTING AGENTS WITH REAL DATA")
    print("=" * 50)
    
    # Test query
    query = "roomie in multan, 20k budget near fast university, studious and quiet"
    
    print(f"Query: {query}")
    print("Running agents...")
    
    # Create session and run
    session = create_session()
    result = session.run(
        agent=roommate_matcher_root_agent,
        user_input=query
    )
    
    print(f"\n📊 AGENT OUTPUT ANALYSIS:")
    print("=" * 30)
    
    # Check for fake IDs in the output
    output_text = str(result)
    
    fake_profiles = ['R-153', 'R-175', 'R-332', 'R-101', 'R-102', 'R-103']
    fake_housing = ['H-M004', 'H-M001', 'H-M002']
    
    print("🔍 Checking for fake profile IDs...")
    found_fake_profiles = []
    for fake_id in fake_profiles:
        if fake_id in output_text:
            found_fake_profiles.append(fake_id)
    
    if found_fake_profiles:
        print(f"❌ Found fake profile IDs: {found_fake_profiles}")
    else:
        print("✅ No fake profile IDs found")
    
    print("\n🔍 Checking for fake housing IDs...")
    found_fake_housing = []
    for fake_id in fake_housing:
        if fake_id in output_text:
            found_fake_housing.append(fake_id)
    
    if found_fake_housing:
        print(f"❌ Found fake housing IDs: {found_fake_housing}")
    else:
        print("✅ No fake housing IDs found")
    
    # Check for real Multan IDs
    real_profiles = ['R-005', 'R-007', 'R-032', 'R-038', 'R-044', 'R-054', 'R-062', 'R-064', 'R-070']
    real_housing = ['H-0001', 'H-0003', 'H-0005', 'H-0010', 'H-0018', 'H-0024']
    
    print("\n🔍 Checking for real profile IDs...")
    found_real_profiles = []
    for real_id in real_profiles:
        if real_id in output_text:
            found_real_profiles.append(real_id)
    
    if found_real_profiles:
        print(f"✅ Found real profile IDs: {found_real_profiles}")
    else:
        print("❌ No real profile IDs found - agents may not be using actual data")
    
    print("\n🔍 Checking for real housing IDs...")
    found_real_housing = []
    for real_id in real_housing:
        if real_id in output_text:
            found_real_housing.append(real_id)
    
    if found_real_housing:
        print(f"✅ Found real housing IDs: {found_real_housing}")
    else:
        print("❌ No real housing IDs found - agents may not be using actual data")
    
    # Overall assessment
    print(f"\n🏆 VALIDATION RESULTS:")
    print("=" * 30)
    
    if not found_fake_profiles and not found_fake_housing:
        if found_real_profiles or found_real_housing:
            print("✅ PASS: Agents are using real data!")
        else:
            print("⚠️  UNCLEAR: No fake IDs found, but also no confirmed real IDs")
    else:
        print("❌ FAIL: Agents are still hallucinating fake IDs")
        print("   Need to fix agent instructions or data access")
    
    return result


if __name__ == "__main__":
    result = test_real_data()
    print(f"\n📄 Full output available for inspection...")
    # Optionally print full output
    # print(f"\n{result}")
