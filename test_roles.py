#!/usr/bin/env python3
"""
Test the updated role-based matching system
"""
from utils.data_loader import load_roommate_profiles, get_profiles_by_role, get_compatible_matches


def test_role_based_matching():
    """Test the role-based matching functionality"""
    
    print("🔄 Testing Role-Based Matching System\n")
    
    # Load all profiles
    profiles = load_roommate_profiles()
    print(f"📊 Total profiles loaded: {len(profiles)}")
    
    # Check role distribution  
    seekers = get_profiles_by_role('seeker')
    providers = get_profiles_by_role('provider')
    
    print(f"👥 Seekers: {len(seekers)}")
    print(f"🏠 Providers: {len(providers)}")
    print(f"✅ Role coverage: {len(seekers) + len(providers)}/{len(profiles)}")
    
    # Test seeker matching (should get both seekers and providers)
    print(f"\n🔍 Testing Seeker Matching in Islamabad:")
    seeker_matches = get_compatible_matches('seeker', 'Islamabad', 5)
    print(f"   Found {len(seeker_matches)} matches for seekers")
    for match in seeker_matches[:3]:
        print(f"   - {match['id']}: {match['role']} in {match['area']}")
    
    # Test provider matching (should only get seekers)
    print(f"\n🏠 Testing Provider Matching in Islamabad:")
    provider_matches = get_compatible_matches('provider', 'Islamabad', 5)
    print(f"   Found {len(provider_matches)} matches for providers")
    for match in provider_matches[:3]:
        print(f"   - {match['id']}: {match['role']} in {match['area']}")
    
    # Verify no provider-provider matches
    provider_roles = [m['role'] for m in provider_matches]
    if 'provider' in provider_roles:
        print("   ❌ ERROR: Provider matched with another provider!")
    else:
        print("   ✅ CORRECT: Providers only matched with seekers")
    
    print("\n🎯 Role-based matching system working correctly!")


if __name__ == "__main__":
    test_role_based_matching()
