#!/usr/bin/env python3
"""
Validation script to test roommate matching with real data.
This ensures agents use actual dataset IDs and don't hallucinate.
"""

import os
import sys
import json
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from utils.data_loader import load_roommate_profiles, load_housing_listings


def validate_dataset():
    """Check dataset integrity and find relevant profiles."""
    print("🔍 DATASET VALIDATION")
    print("=" * 50)
    
    # Load datasets
    profiles = load_roommate_profiles()
    listings = load_housing_listings()
    
    print(f"📊 Total profiles: {len(profiles)}")
    print(f"🏠 Total listings: {len(listings)}")
    
    # Find Multan profiles
    multan_profiles = [p for p in profiles if p.get('city', '').lower() == 'multan']
    print(f"\n🏙️ Multan profiles found: {len(multan_profiles)}")
    
    # Show actual Multan profiles with relevant criteria
    print("\n📋 ACTUAL MULTAN PROFILES (for validation):")
    for profile in multan_profiles[:10]:  # Show first 10
        role = profile.get('role', 'unknown')
        budget = profile.get('budget_PKR', 'N/A')
        area = profile.get('area', 'N/A')
        study = profile.get('study_habits', 'N/A')
        noise = profile.get('noise_tolerance', 'N/A')
        
        print(f"  • {profile['id']}: {area}, {budget} PKR, {role}")
        print(f"    Study: {study}, Noise: {noise}")
    
    # Find Multan housing
    multan_housing = [h for h in listings if h.get('city', '').lower() == 'multan']
    print(f"\n🏘️ Multan housing found: {len(multan_housing)}")
    
    # Show actual Multan housing
    print("\n🏠 ACTUAL MULTAN HOUSING (for validation):")
    for listing in multan_housing[:8]:  # Show first 8
        rent = listing.get('monthly_rent_PKR', 'N/A')
        area = listing.get('area', 'N/A')
        rooms = listing.get('rooms_available', 'N/A')
        amenities = listing.get('amenities', [])
        
        print(f"  • {listing['listing_id']}: {area}, {rent} PKR/month")
        print(f"    Rooms: {rooms}, Amenities: {', '.join(amenities[:3])}...")
    
    return multan_profiles, multan_housing


def find_compatible_for_query():
    """Find actual matches for the Multan query."""
    print("\n\n🎯 QUERY ANALYSIS: 'Roomie in Multan, 20k budget, studious and quiet'")
    print("=" * 70)
    
    profiles = load_roommate_profiles()
    
    # User profile
    user_profile = {
        "city": "Multan",
        "budget_PKR": 20000,
        "study_habits": "Studious",
        "noise_tolerance": "Quiet",
        "role": "seeker"
    }
    
    # Filter for compatible matches
    compatible = []
    for profile in profiles:
        # Must be in Multan
        if profile.get('city', '').lower() != 'multan':
            continue
        
        # Role matching: seeker can match with seeker OR provider
        profile_role = profile.get('role', '').lower()
        if profile_role not in ['seeker', 'provider']:
            continue
            
        # Budget consideration (within 10k range)
        profile_budget = profile.get('budget_PKR', 0)
        if abs(profile_budget - 20000) > 10000:
            continue
        
        # Prefer studious/quiet types
        study = profile.get('study_habits', '').lower()
        noise = profile.get('noise_tolerance', '').lower()
        
        score = 60  # Base score
        
        # Study compatibility
        if 'focused' in study or 'library' in study or 'online' in study:
            score += 20
        elif 'late-night' in study:
            score += 10
            
        # Noise compatibility  
        if 'quiet' in noise:
            score += 15
        elif 'loud' in noise:
            score -= 10
            
        # Budget alignment
        budget_diff = abs(profile_budget - 20000)
        if budget_diff <= 3000:
            score += 10
        elif budget_diff <= 7000:
            score += 5
            
        if score >= 70:  # Only good matches
            compatible.append({
                'profile': profile,
                'score': score
            })
    
    # Sort by score
    compatible.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"✅ Found {len(compatible)} compatible matches:")
    print("\n🏆 TOP ACTUAL MATCHES:")
    
    for i, match in enumerate(compatible[:5], 1):
        profile = match['profile']
        score = match['score']
        
        print(f"\n{i}. {profile['id']} - Score: {score}/100")
        print(f"   Location: {profile.get('area', 'N/A')}, Multan")
        print(f"   Budget: {profile.get('budget_PKR', 'N/A')} PKR")
        print(f"   Role: {profile.get('role', 'N/A')}")
        print(f"   Study: {profile.get('study_habits', 'N/A')}")
        print(f"   Noise: {profile.get('noise_tolerance', 'N/A')}")
        print(f"   Raw: {profile.get('raw_profile_text', 'N/A')[:50]}...")
    
    return compatible


def find_suitable_housing():
    """Find actual housing for the matches."""
    print(f"\n\n🏠 HOUSING SEARCH: Budget ~40k combined (20k each)")
    print("=" * 50)
    
    listings = load_housing_listings()
    multan_housing = [h for h in listings if h.get('city', '').lower() == 'multan']
    
    # Filter by budget (looking for 2-person sharing, so 30k-50k range)
    suitable = []
    for listing in multan_housing:
        rent = listing.get('monthly_rent_PKR', 0)
        rooms = listing.get('rooms_available', 0)
        
        # Budget range for 2 people (15k-25k per person)
        if 30000 <= rent <= 50000 and rooms >= 2:
            suitable.append(listing)
        elif 20000 <= rent <= 35000 and rooms >= 1:  # Could share 1 room
            suitable.append(listing)
    
    print(f"✅ Found {len(suitable)} suitable housing options:")
    
    for i, listing in enumerate(suitable[:5], 1):
        rent = listing.get('monthly_rent_PKR', 0)
        per_person = rent // 2
        
        print(f"\n{i}. {listing['listing_id']}")
        print(f"   Location: {listing.get('area', 'N/A')}, Multan")
        print(f"   Rent: {rent:,} PKR/month ({per_person:,} per person)")
        print(f"   Rooms: {listing.get('rooms_available', 'N/A')}")
        print(f"   Amenities: {', '.join(listing.get('amenities', [])[:4])}")
        print(f"   Status: {listing.get('availability', 'N/A')}")
    
    return suitable


def main():
    """Run complete validation."""
    try:
        # Validate datasets
        multan_profiles, multan_housing = validate_dataset()
        
        # Find actual matches
        compatible_matches = find_compatible_for_query()
        
        # Find actual housing  
        suitable_housing = find_suitable_housing()
        
        print(f"\n\n🎉 VALIDATION COMPLETE!")
        print("=" * 50)
        print(f"✅ Dataset loaded successfully")
        print(f"✅ {len(multan_profiles)} Multan profiles available")
        print(f"✅ {len(multan_housing)} Multan housing available") 
        print(f"✅ {len(compatible_matches)} compatible matches found")
        print(f"✅ {len(suitable_housing)} suitable housing options found")
        
        print(f"\n💡 AGENT VALIDATION NOTES:")
        print(f"• Agents should ONLY use profile IDs from the actual dataset")
        print(f"• Agents should ONLY use listing IDs from the actual dataset")
        print(f"• NO fictional IDs like R-153, H-M004 should ever appear")
        print(f"• All data should match what we found in this validation")
        
    except Exception as e:
        print(f"❌ Validation failed: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
