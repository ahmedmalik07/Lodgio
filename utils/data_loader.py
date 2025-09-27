import json
import os
import asyncio
from typing import List, Dict, Any, Optional, Union
import logging

# Optional vector database imports - fallback to local JSON if not available
try:
    from .supabase_setup import RoommateVectorDB
    VECTOR_DB_AVAILABLE = True
except ImportError:
    VECTOR_DB_AVAILABLE = False
    logging.warning("Vector database not available. Using local JSON fallback.")


def load_roommate_profiles() -> List[Dict[str, Any]]:
    """Load the synthetic roommate profiles dataset with roles."""
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "new_synthetic_roommate_profiles_pakistan_400_with_roles.json")
    with open(dataset_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_housing_listings() -> List[Dict[str, Any]]:
    """Load the housing listings dataset."""
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "housing_listings_pakistan_400.json")
    with open(dataset_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_profiles_by_role(role: str) -> List[Dict[str, Any]]:
    """Filter profiles by role (provider or seeker)."""
    profiles = load_roommate_profiles()
    return [profile for profile in profiles if profile.get('role', '').lower() == role.lower()]


def get_profiles_by_city(city: str) -> List[Dict[str, Any]]:
    """Filter profiles by city."""
    profiles = load_roommate_profiles()
    return [profile for profile in profiles if profile.get('city', '').lower() == city.lower()]


def get_available_housing_by_city(city: str) -> List[Dict[str, Any]]:
    """Filter available housing listings by city."""
    listings = load_housing_listings()
    return [listing for listing in listings 
            if listing.get('city', '').lower() == city.lower() 
            and listing.get('availability') == 'Available']


def get_compatible_matches(user_role: str, user_city: str, max_results: int=10) -> List[Dict[str, Any]]:
    """
    Find compatible profiles based on role matching rules:
    - Seekers can match with Seekers OR Providers
    - Providers should NOT match with other Providers
    """
    all_profiles = load_roommate_profiles()
    compatible = []
    
    for profile in all_profiles:
        profile_role = profile.get('role', '').lower()
        profile_city = profile.get('city', '')
        
        # Same city filter
        if profile_city.lower() != user_city.lower():
            continue
            
        # Role matching logic
        if user_role.lower() == 'seeker':
            # Seekers can match with both seekers and providers
            if profile_role in ['seeker', 'provider']:
                compatible.append(profile)
        elif user_role.lower() == 'provider':
            # Providers should only match with seekers, NOT other providers
            if profile_role == 'seeker':
                compatible.append(profile)
    
    return compatible[:max_results]


def search_compatible_profiles(target_profile: Dict[str, Any], max_results: int=10) -> List[Dict[str, Any]]:
    """Find profiles that are compatible with the target profile using role-based matching."""
    user_role = target_profile.get('role', 'seeker')  # Default to seeker if not specified
    user_city = target_profile.get('city', '')
    
    return get_compatible_matches(user_role, user_city, max_results)

# ============================================================================
# ENHANCED VECTOR DATABASE FUNCTIONS (with JSON fallback)
# ============================================================================


_vector_db_instance = None


def get_vector_db():
    """Get or create vector database instance."""
    global _vector_db_instance
    if not VECTOR_DB_AVAILABLE:
        return None
    
    if _vector_db_instance is None:
        try:
            _vector_db_instance = RoommateVectorDB()
        except Exception as e:
            logging.warning(f"Could not initialize vector database: {e}")
            return None
    
    return _vector_db_instance


async def semantic_search_roommates(query: str, user_role: str='seeker',
                                  user_city: str='', max_results: int=10) -> List[Dict[str, Any]]:
    """
    Enhanced semantic search for roommate profiles using vector database.
    Falls back to traditional search if vector DB is unavailable.
    """
    db = get_vector_db()
    
    if db is None:
        # Fallback to local JSON search
        logging.info("Using local JSON fallback for roommate search")
        return get_compatible_matches(user_role, user_city, max_results)
    
    try:
        # Use vector database for semantic search
        results = await db.semantic_search_profiles(
            query=query,
            limit=max_results,
            role_filter=user_role,
            city_filter=user_city
        )
        
        # Extract profiles from vector search results
        profiles = []
        for result in results:
            profile = result.get('profile', {})
            profile['similarity_score'] = result.get('similarity', 0.0)
            profiles.append(profile)
        
        return profiles
        
    except Exception as e:
        logging.warning(f"Vector search failed, using fallback: {e}")
        return get_compatible_matches(user_role, user_city, max_results)


async def semantic_search_housing(query: str, city: str='',
                                max_budget: Optional[int]=None,
                                max_results: int=10) -> List[Dict[str, Any]]:
    """
    Enhanced semantic search for housing listings using vector database.
    Falls back to traditional search if vector DB is unavailable.
    """
    db = get_vector_db()
    
    if db is None:
        # Fallback to local JSON search
        logging.info("Using local JSON fallback for housing search")
        return get_available_housing_by_city(city)[:max_results]
    
    try:
        # Use vector database for semantic search
        results = await db.semantic_search_housing(
            query=query,
            limit=max_results,
            city_filter=city,
            max_budget=max_budget
        )
        
        # Extract listings from vector search results
        listings = []
        for result in results:
            listing = result.get('listing', {})
            listing['similarity_score'] = result.get('similarity', 0.0)
            listings.append(listing)
        
        return listings
        
    except Exception as e:
        logging.warning(f"Vector housing search failed, using fallback: {e}")
        return get_available_housing_by_city(city)[:max_results]


def sync_search_roommates(query: str, user_role: str='seeker',
                         user_city: str='', max_results: int=10) -> List[Dict[str, Any]]:
    """
    Synchronous wrapper for semantic roommate search.
    Use this in agents that don't support async operations.
    """
    try:
        # Try to run async search
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're in an async context, create a new thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    asyncio.run,
                    semantic_search_roommates(query, user_role, user_city, max_results)
                )
                return future.result(timeout=30)
        else:
            # Safe to run async
            return asyncio.run(semantic_search_roommates(query, user_role, user_city, max_results))
    except Exception as e:
        logging.warning(f"Async search failed, using local fallback: {e}")
        return get_compatible_matches(user_role, user_city, max_results)


def sync_search_housing(query: str, city: str='',
                       max_budget: Optional[int]=None,
                       max_results: int=10) -> List[Dict[str, Any]]:
    """
    Synchronous wrapper for semantic housing search.
    Use this in agents that don't support async operations.
    """
    try:
        # Try to run async search
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're in an async context, create a new thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    asyncio.run,
                    semantic_search_housing(query, city, max_budget, max_results)
                )
                return future.result(timeout=30)
        else:
            # Safe to run async
            return asyncio.run(semantic_search_housing(query, city, max_budget, max_results))
    except Exception as e:
        logging.warning(f"Async housing search failed, using local fallback: {e}")
        return get_available_housing_by_city(city)[:max_results]

# ============================================================================
# COMPATIBILITY FUNCTIONS (maintain backward compatibility)
# ============================================================================


def enhanced_search_compatible_profiles(target_profile: Dict[str, Any],
                                      max_results: int=10) -> List[Dict[str, Any]]:
    """
    Enhanced version of search_compatible_profiles that uses semantic search
    when available, with smart query generation from profile data.
    """
    user_role = target_profile.get('role', 'seeker')
    user_city = target_profile.get('city', '')
    
    # Generate a natural language query from profile data
    query_parts = []
    
    if target_profile.get('sleep_schedule'):
        query_parts.append(f"{target_profile['sleep_schedule']} sleeper")
    
    if target_profile.get('cleanliness'):
        query_parts.append(f"{target_profile['cleanliness']} person")
    
    if target_profile.get('study_habits'):
        query_parts.append(f"{target_profile['study_habits']} student")
    
    if target_profile.get('food_pref'):
        query_parts.append(f"prefers {target_profile['food_pref']} food")
    
    # Fallback query if no specific attributes
    if not query_parts:
        query_parts.append(f"{user_role} looking for roommate")
    
    query = " ".join(query_parts)
    
    # Use semantic search if available
    return sync_search_roommates(query, user_role, user_city, max_results)
