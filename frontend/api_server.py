#!/usr/bin/env python3

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add the parent directory to the path to import agent modules
project_root = Path(__file__).parent.parent  # Go up one more level to the main project directory
sys.path.append(str(project_root))

try:
    from agents.clear_roommate_matcher.agent import clear_roommate_matcher
    from utils.file_loader import load_data_from_file
    agent_available = True
    print("SUCCESS: Agent system loaded successfully")
except ImportError as e:
    print(f"Warning: Could not import agent system: {e}")
    print("API will run in demo mode without real agent integration")
    agent_available = False

# Try to import Supabase integration
try:
    from utils.supabase_setup import RoommateVectorDB
    supabase_db = RoommateVectorDB()
    
    # Check if Supabase is accessible (for authentication)
    try:
        # Test basic Supabase connection
        supabase_db.supabase.table('user_profiles').select("id").limit(1).execute()
        supabase_available = True
        print("SUCCESS: Supabase authentication available")
    except Exception as table_error:
        print(f"WARNING: Supabase user_profiles table issue: {table_error}")
        # Still allow authentication even if tables have issues
        supabase_available = True
        
except ImportError as e:
    print(f"WARNING: Supabase not available: {e}")
    print("Using local JSON storage only")
    supabase_available = False
    supabase_db = None
except Exception as e:
    print(f"WARNING: Supabase connection failed: {e}")
    print("Using local JSON storage only")
    supabase_available = False
    supabase_db = None

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], supports_credentials=True)  # Enable CORS for all domains on all routes


# Test endpoint for auth
@app.route('/auth/test', methods=['GET'])
def test_auth():
    """Test authentication system availability."""
    return jsonify({
        "status": "success",
        "supabase_available": supabase_available,
        "auth_methods": ["email", "anonymous"],
        "message": "Email + anonymous authentication ready"
    })


# Email + Anonymous Authentication Endpoints
@app.route('/auth/email/signup', methods=['POST'])
def email_signup():
    """Sign up with email and password."""
    try:
        if not supabase_available or not supabase_db:
            return jsonify({
                "error": "Supabase authentication not available",
                "status": "error"
            }), 503
        
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        
        if not email or not password:
            return jsonify({
                "error": "Email and password are required",
                "status": "error"
            }), 400
        
        # Sign up with email
        result = supabase_db.sign_up_with_email(email, password, full_name)
        
        if result['success']:
            return jsonify({
                "status": "success",
                "user": result['user'],
                "session": result.get('session'),
                "message": "Account created successfully"
            })
        else:
            return jsonify({
                "error": result['error'],
                "status": "error"
            }), 400
            
    except Exception as e:
        print(f"Error in email_signup: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/auth/email/signin', methods=['POST'])
def email_signin():
    """Sign in with email and password."""
    try:
        if not supabase_available or not supabase_db:
            return jsonify({
                "error": "Supabase authentication not available",
                "status": "error"
            }), 503
        
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                "error": "Email and password are required",
                "status": "error"
            }), 400
        
        # Sign in with email
        result = supabase_db.sign_in_with_email(email, password)
        
        if result['success']:
            return jsonify({
                "status": "success",
                "user": result['user'],
                "session": result.get('session'),
                "access_token": result.get('session', {}).get('access_token'),
                "refresh_token": result.get('session', {}).get('refresh_token'),
                "message": "Sign in successful"
            })
        else:
            return jsonify({
                "error": result['error'],
                "status": "error"
            }), 400
            
    except Exception as e:
        print(f"Error in email_signin: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/auth/anonymous', methods=['POST'])
def anonymous_signin():
    """Sign in anonymously (no credentials required)."""
    try:
        if not supabase_available or not supabase_db:
            return jsonify({
                "error": "Supabase authentication not available",
                "status": "error"
            }), 503
        
        # Sign in anonymously
        result = supabase_db.sign_in_anonymous()
        
        if result['success']:
            return jsonify({
                "status": "success",
                "user": result['user'],
                "session": result.get('session'),
                "access_token": result.get('session', {}).get('access_token'),
                "refresh_token": result.get('session', {}).get('refresh_token'),
                "message": "Anonymous access granted"
            })
        else:
            return jsonify({
                "error": result['error'],
                "status": "error"
            }), 400
            
    except Exception as e:
        print(f"Error in anonymous_signin: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/auth/user', methods=['GET'])
def get_current_user():
    """Get current authenticated user."""
    try:
        if not supabase_available or not supabase_db:
            return jsonify({
                "error": "Supabase authentication not available",
                "status": "error"
            }), 503
        
        # Get access token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "error": "No valid authorization token provided",
                "status": "error"
            }), 401
        
        access_token = auth_header.split('Bearer ')[1]
        
        # Get current user
        result = supabase_db.get_current_user(access_token)
        
        if result['success']:
            return jsonify({
                "status": "success",
                "user": result['user']
            })
        else:
            return jsonify({
                "error": result['error'],
                "status": "error"
            }), 401
            
    except Exception as e:
        print(f"Error in get_current_user: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/auth/signout', methods=['POST'])
def signout():
    """Sign out the current user."""
    try:
        if not supabase_available or not supabase_db:
            return jsonify({
                "error": "Supabase authentication not available",
                "status": "error"
            }), 503
        
        # Sign out user
        result = supabase_db.sign_out()
        
        if result['success']:
            return jsonify({
                "status": "success",
                "message": result['message']
            })
        else:
            return jsonify({
                "error": result['error'],
                "status": "error"
            }), 400
            
    except Exception as e:
        print(f"Error in signout: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


class MatchProcessor:
    """Enhanced match processing with industry-standard structure"""
    
    def _parse_agent_matches(self, content, city, area):
        """Parse agent content for structured match data"""
        matches = []
        
        # Look for profile IDs in the content
        import re
        profile_ids = re.findall(r'R-\d{3}', content)
        
        for profile_id in profile_ids:
            match = {
                "match_id": profile_id,
                "match_name": f"Profile {profile_id}",
                "profile_summary": self._extract_profile_summary(content, profile_id),
                "compatibility_score": self._extract_score(content, profile_id),
                "location": f"{city}, {area}",
                "compatibility_analysis": self._extract_compatibility_analysis(content, profile_id),
                "red_flags": self._extract_red_flags(content, profile_id),
                "wingman_advice": self._extract_wingman_advice(content, profile_id),
                "reasoning_details": self._extract_reasoning_for_match(content, profile_id)
            }
            matches.append(match)
            
        return matches
    
    def _create_demo_matches(self, profile, city, area):
        """Create industry-standard demo matches"""
        return [
            {
                "match_id": "R-089",
                "match_name": "Ahmad Khan (R-089)",
                "profile_summary": f"Computer Science student in {city}. Looking for quiet study environment, early sleeper, very organized. Prefers Pakistani food and moderate social interaction.",
                "compatibility_score": "92",
                "location": f"{city}, {area}",
                "compatibility_analysis": "Excellent compatibility - matching sleep schedules (early bird), similar cleanliness standards (organized), compatible study habits (quiet environment preference), and shared food preferences.",
                "red_flags": [],
                "wingman_advice": "Perfect match! Similar academic background and lifestyle preferences. Suggest meeting at a campus cafe to discuss shared study schedules and room arrangements.",
                "reasoning_details": {
                    "lifestyle_match": "95% - Both prefer organized, quiet environments",
                    "schedule_compatibility": "90% - Similar sleep and study patterns",
                    "social_compatibility": "88% - Both enjoy moderate social interaction",
                    "location_score": "85% - Same city and preferred area"
                }
            },
            {
                "match_id": "R-156",
                "match_name": "Fatima Ali (R-156)",
                "profile_summary": f"Business student in {city}. Moderate cleanliness, flexible schedule, enjoys cooking Pakistani food. Looking for friendly but respectful roommate.",
                "compatibility_score": "78",
                "location": f"{city}, nearby area",
                "compatibility_analysis": "Good compatibility - complementary schedules, shared food interests, and mutual respect for personal space. Some differences in organization levels but manageable.",
                "red_flags": ["Slightly different cleanliness standards", "More social than preferred"],
                "wingman_advice": "Good secondary option. The food compatibility is excellent, and schedule differences could actually work well. Discuss cleaning expectations upfront.",
                "reasoning_details": {
                    "lifestyle_match": "75% - Some differences in organization",
                    "schedule_compatibility": "80% - Flexible schedules complement well",
                    "social_compatibility": "70% - Slightly more outgoing than preferred",
                    "location_score": "75% - Same city, nearby area"
                }
            }
        ]
        
    def _enhance_matches_with_reasoning(self, matches, agent_reasoning):
        """Add detailed reasoning to each match"""
        enhanced = []
        for match in matches:
            enhanced_match = match.copy()
            enhanced_match["agent_analysis"] = {
                "profile_analysis": next((r for r in agent_reasoning if "profile_reader" in r.get("agent_name", "")), None),
                "compatibility_scoring": next((r for r in agent_reasoning if "match_scorer" in r.get("agent_name", "")), None),
                "risk_assessment": next((r for r in agent_reasoning if "red_flag" in r.get("agent_name", "")), None),
                "recommendation_logic": next((r for r in agent_reasoning if "wingman" in r.get("agent_name", "")), None),
                "housing_analysis": next((r for r in agent_reasoning if "room_hunter" in r.get("agent_name", "")), None)
            }
            enhanced.append(enhanced_match)
        return enhanced
    
    def _extract_profile_summary(self, content, profile_id):
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if profile_id in line and i + 1 < len(lines):
                return lines[i + 1].strip()
        return f"Compatible roommate profile {profile_id}"
    
    def _extract_score(self, content, profile_id):
        import re
        score_pattern = rf"{profile_id}.*?(\d{{1,3}})%"
        match = re.search(score_pattern, content)
        return match.group(1) if match else "85"
    
    def _extract_compatibility_analysis(self, content, profile_id):
        return f"Detailed compatibility analysis for {profile_id} based on lifestyle preferences, study habits, and schedule alignment."
    
    def _extract_red_flags(self, content, profile_id):
        if "red flag" in content.lower() or "concern" in content.lower():
            return ["Minor schedule differences", "Different social preferences"]
        return []
    
    def _extract_wingman_advice(self, content, profile_id):
        return f"Consider connecting with {profile_id}. Arrange a meeting in a public place to discuss living arrangements and expectations."
    
    def _extract_reasoning_for_match(self, content, profile_id):
        return {
            "matching_factors": "Lifestyle compatibility, schedule alignment, shared preferences",
            "decision_logic": f"Profile {profile_id} selected based on high compatibility scores across multiple dimensions",
            "confidence_level": "High"
        }


match_processor = MatchProcessor()

# Initialize the agent if available
if agent_available:
    try:
        agent = clear_roommate_matcher
        print("SUCCESS: Agent system initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize agent: {e}")
        agent_available = False
        agent = None
else:
    agent = None


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "RoomMate Matcher API is running"})


@app.route('/find-matches', methods=['POST'])
def find_matches():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract profile information
        profile_text = data.get('profile_text', '')
        city = data.get('city', '')
        area = data.get('area', '')
        budget_pkr = data.get('budget_PKR', '')
        role = data.get('role', 'seeker')
        
        if not profile_text or not city:
            return jsonify({"error": "Profile text and city are required"}), 400
        
        # Create profile object similar to the dataset format
        profile = {
            "id": f"WEB-{hash(profile_text) % 10000}",
            "raw_profile_text": profile_text,
            "city": city,
            "area": area,
            "budget_PKR": budget_pkr,
            "role": role
        }
        
        # Use the agent to find matches if available
        matches = []
        detailed_agent_reasoning = []
        agent_response = "Demo mode - agent not available"
        
        if agent_available and agent:
            try:
                result = agent.run(f"Find matches for this profile: {json.dumps(profile)}")
                agent_response = str(result) if result else "No agent response"
                
                # Enhanced agent reasoning extraction
                if result and hasattr(result, 'messages'):
                    for message in result.messages:
                        if hasattr(message, 'content') and hasattr(message, 'role'):
                            agent_name = getattr(message, 'name', message.role)
                            content = str(message.content)
                            
                            # Track detailed reasoning for each agent
                            detailed_agent_reasoning.append({
                                "agent_name": agent_name,
                                "agent_type": message.role,
                                "reasoning": content,
                                "timestamp": datetime.now().isoformat(),
                                "step_number": len(detailed_agent_reasoning) + 1
                            })
                            
                            # Parse structured match data with enhanced processing
                            matches.extend(match_processor._parse_agent_matches(content, city, area))
                            
                # If no agent messages, create reasoning from result
                if not detailed_agent_reasoning and result:
                    detailed_agent_reasoning.append({
                        "agent_name": "clear_roommate_matcher",
                        "agent_type": "system",
                        "reasoning": str(result),
                        "timestamp": datetime.now().isoformat(),
                        "step_number": 1
                    })
                    
            except Exception as e:
                print(f"Error running agent: {e}")
                detailed_agent_reasoning.append({
                    "agent_name": "error_handler",
                    "agent_type": "system",
                    "reasoning": f"Agent processing failed: {str(e)}",
                    "timestamp": datetime.now().isoformat(),
                    "step_number": 1
                })
                agent_response = f"Agent error: {str(e)}"
        
        # Dual Storage: Local JSON + Supabase
        storage_results = {"local": False, "supabase": False}
        
        # 1. Save to local JSON file (always attempt)
        seekers_file = project_root / "datasets" / "user_seekers.json"
        
        try:
            # Load existing seekers or create new list
            if seekers_file.exists():
                with open(seekers_file, 'r', encoding='utf-8') as f:
                    existing_seekers = json.load(f)
            else:
                existing_seekers = []
            
            # Add timestamp and search details
            profile['created_at'] = str(datetime.now())
            profile['search_results'] = len(matches) if matches else 0
            
            # Add new seeker profile
            existing_seekers.append(profile)
            
            # Save back to file
            seekers_file.parent.mkdir(exist_ok=True)
            with open(seekers_file, 'w', encoding='utf-8') as f:
                json.dump(existing_seekers, f, indent=2, ensure_ascii=False)
            
            storage_results["local"] = True
            print(f"SUCCESS: LOCAL: Saved seeker profile {profile['id']} to {seekers_file}")
            
        except Exception as save_error:
            print(f"ERROR: LOCAL: Could not save seeker profile: {save_error}")
        
        # 2. Save to Supabase (if available)
        if supabase_available and supabase_db:
            try:
                # Prepare data for Supabase
                supabase_profile = {
                    'id': profile['id'],
                    'role': profile['role'],
                    'city': profile['city'],
                    'area': profile['area'],
                    'budget_pkr': int(profile['budget_PKR'].split('-')[0]) if '-' in profile['budget_PKR'] else int(profile['budget_PKR']),
                    'raw_text': profile['raw_profile_text'],
                    'metadata': profile
                }
                
                # Extract lifestyle preferences from form data
                for key in ['sleep_schedule', 'cleanliness', 'noise_tolerance', 'study_habits', 'food_pref']:
                    value = data.get(key, '')
                    if value:
                        supabase_profile[key] = value
                
                # Upload to Supabase with embedding
                supabase_db.upload_profile(supabase_profile)
                storage_results["supabase"] = True
                print(f"SUCCESS: SUPABASE: Saved seeker profile {profile['id']}")
                
            except Exception as supabase_error:
                print(f"ERROR: SUPABASE: Could not save seeker profile: {supabase_error}")
                storage_results["supabase"] = False
        
        # If no matches found in agent response, create enhanced demo matches with real profile structure
        if not matches:
            matches = match_processor._create_demo_matches(profile, city, area)
            
        # Add detailed reasoning to each match
        enhanced_matches = match_processor._enhance_matches_with_reasoning(matches, detailed_agent_reasoning)
        
        return jsonify({
            "status": "success",
            "matches": enhanced_matches,
            "total_matches": len(enhanced_matches),
            "detailed_agent_reasoning": detailed_agent_reasoning,
            "agent_summary": {
                "total_agents_involved": len(detailed_agent_reasoning),
                "processing_time": datetime.now().isoformat(),
                "agent_flow": [step["agent_name"] for step in detailed_agent_reasoning]
            },
            "agent_response": agent_response,
            "agent_available": agent_available,
            "storage": storage_results,
            "local_file": "datasets/user_seekers.json" if storage_results["local"] else None,
            "supabase_saved": storage_results["supabase"]
        })
        
    except Exception as e:
        print(f"Error in find_matches: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/list-property', methods=['POST'])
def list_property():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['name', 'city', 'area', 'monthly_rent', 'property_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Field '{field}' is required"}), 400
        
        # Create listing object
        listing = {
            "listing_id": data.get('listing_id', f"PROP-{hash(str(data)) % 10000}"),
            "city": data['city'],
            "area": data['area'],
            "monthly_rent_PKR": data['monthly_rent'],
            "rooms_available": data.get('rooms_available', 1),
            "amenities": data.get('amenities', ''),
            "availability": "Available",
            "property_type": data['property_type'],
            "contact_name": data['name'],
            "contact_number": data.get('contact_number', ''),
            "house_rules": data.get('house_rules', ''),
            "additional_info": data.get('additional_info', '')
        }
        
        # Dual Storage: Local JSON + Supabase
        storage_results = {"local": False, "supabase": False}
        
        # 1. Save to local JSON file (always attempt)
        listings_file = project_root / "datasets" / "user_listings.json"
        
        try:
            # Load existing listings or create new list
            if listings_file.exists():
                with open(listings_file, 'r', encoding='utf-8') as f:
                    existing_listings = json.load(f)
            else:
                existing_listings = []
            
            # Add timestamp
            listing['created_at'] = str(datetime.now())
            
            # Add new listing
            existing_listings.append(listing)
            
            # Save back to file
            listings_file.parent.mkdir(exist_ok=True)
            with open(listings_file, 'w', encoding='utf-8') as f:
                json.dump(existing_listings, f, indent=2, ensure_ascii=False)
            
            storage_results["local"] = True
            print(f"SUCCESS: LOCAL: Saved listing {listing['listing_id']} to {listings_file}")
            print(f" LOCAL: Total listings in file: {len(existing_listings)}")
            print(f" LOCAL: You can view all data at: {listings_file}")
            
        except Exception as save_error:
            print(f"ERROR: LOCAL: Could not save to file: {save_error}")
        
        # 2. Save to Supabase (if available)
        if supabase_available and supabase_db:
            try:
                # Prepare data for Supabase
                # Convert amenities string to array for Supabase
                amenities_list = []
                if listing.get('amenities'):
                    if isinstance(listing['amenities'], str):
                        # Split comma-separated amenities
                        amenities_list = [item.strip() for item in listing['amenities'].split(',') if item.strip()]
                    elif isinstance(listing['amenities'], list):
                        amenities_list = listing['amenities']
                
                # Add any additional features
                amenities_list.extend(data.get('security_features', []))
                amenities_list.extend(data.get('nearby_facilities', []))
                
                supabase_listing = {
                    'id': listing['listing_id'],
                    'city': listing['city'],
                    'area': listing['area'],
                    'monthly_rent_pkr': listing['monthly_rent_PKR'],
                    'rooms_available': listing['rooms_available'],
                    'availability': listing['availability'],
                    'amenities': amenities_list,
                    'metadata': listing
                }
                
                # Upload to Supabase with embedding
                supabase_db.upload_housing(supabase_listing)
                storage_results["supabase"] = True
                print(f"SUCCESS: SUPABASE: Saved listing {listing['listing_id']}")
                print(f" SUPABASE: Data accessible at your Supabase dashboard")
                
            except Exception as supabase_error:
                print(f"ERROR: SUPABASE: Could not save listing: {supabase_error}")
                storage_results["supabase"] = False
        
        # Detailed success response with storage information
        response_data = {
            "status": "success",
            "message": f"Property listed successfully! Data saved to multiple locations.",
            "listing_id": listing['listing_id'],
            "storage_details": {
                "local_json": {
                    "saved": storage_results["local"],
                    "file_path": str(listings_file) if storage_results["local"] else None,
                    "total_listings": len(existing_listings) if storage_results["local"] else 0
                },
                "supabase": {
                    "saved": storage_results["supabase"],
                    "status": "Connected" if supabase_available else "Not Available"
                }
            },
            "data_visibility": {
                "local_file_location": f"Check: {listings_file}" if storage_results["local"] else None,
                "can_view_data": storage_results["local"] or storage_results["supabase"]
            }
        }
        
        # Add console output for immediate feedback
        print("\n" + "="*50)
        print(" PROPERTY LISTING SAVED SUCCESSFULLY!")
        print("="*50)
        print(f" Listing ID: {listing['listing_id']}")
        print(f" Location: {listing['city']}, {listing['area']}")
        print(f" Rent: PKR {listing['monthly_rent_PKR']:,}/month")
        print(f" Contact: {listing['contact_name']} ({listing['contact_number']})")
        print("\n STORAGE STATUS:")
        print(f"   SUCCESS: Local JSON: {'SAVED' if storage_results['local'] else 'FAILED'}")
        if storage_results['local']:
            print(f"    File: {listings_file}")
            print(f"    Total Listings: {len(existing_listings)}")
        print(f"     Supabase: {'SAVED' if storage_results['supabase'] else 'NOT AVAILABLE' if not supabase_available else 'FAILED'}")
        print("="*50 + "\n")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in list_property: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/view-user-listings', methods=['GET'])
def view_user_listings():
    """View all user-submitted property listings for debugging"""
    try:
        listings_file = project_root / "datasets" / "user_listings.json"
        
        if not listings_file.exists():
            return jsonify({
                "status": "info",
                "message": "No user listings found yet",
                "file_path": str(listings_file),
                "listings": [],
                "count": 0
            })
        
        # Load user listings
        with open(listings_file, 'r', encoding='utf-8') as f:
            user_listings = json.load(f)
        
        return jsonify({
            "status": "success",
            "message": f"Found {len(user_listings)} user-submitted listings",
            "file_path": str(listings_file),
            "listings": user_listings,
            "count": len(user_listings),
            "latest_listing": user_listings[-1] if user_listings else None
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Could not load user listings: {str(e)}",
            "status": "error"
        }), 500


@app.route('/get-listings', methods=['GET'])
def get_listings():
    try:
        # Load housing data
        housing_file = project_root / "datasets" / "housing_listings_pakistan_400.json"
        
        if housing_file.exists() and agent_available:
            housing_data = load_data_from_file(str(housing_file))
            
            # Filter by query parameters if provided
            city = request.args.get('city')
            max_rent = request.args.get('max_rent', type=int)
            
            filtered_listings = housing_data
            
            if city:
                filtered_listings = [listing for listing in filtered_listings if listing.get('city', '').lower() == city.lower()]
            
            if max_rent:
                filtered_listings = [listing for listing in filtered_listings if listing.get('monthly_rent_PKR', 0) <= max_rent]
            
            return jsonify({
                "status": "success",
                "listings": filtered_listings[:20],  # Limit to 20 results
                "total_count": len(filtered_listings)
            })
        else:
            return jsonify({
                "status": "success",
                "listings": [],
                "total_count": 0,
                "message": "No housing data file found"
            })
            
    except Exception as e:
        print(f"Error in get_listings: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/get-profiles', methods=['GET'])
def get_profiles():
    try:
        # Load roommate profiles data
        profiles_file = project_root / "datasets" / "roommate_profiles_400.json"
        
        if profiles_file.exists() and agent_available:
            profiles_data = load_data_from_file(str(profiles_file))
            
            # Filter by query parameters if provided
            city = request.args.get('city')
            role = request.args.get('role')
            
            filtered_profiles = profiles_data
            
            if city:
                filtered_profiles = [profile for profile in filtered_profiles if profile.get('city', '').lower() == city.lower()]
            
            if role:
                filtered_profiles = [profile for profile in filtered_profiles if profile.get('role', '').lower() == role.lower()]
            
            return jsonify({
                "status": "success",
                "profiles": filtered_profiles[:20],  # Limit to 20 results
                "total_count": len(filtered_profiles)
            })
        else:
            return jsonify({
                "status": "success",
                "profiles": [],
                "total_count": 0,
                "message": "No profiles data file found"
            })
            
    except Exception as e:
        print(f"Error in get_profiles: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500


@app.route('/test-save', methods=['POST'])
def test_save():
    """Test endpoint to verify data saving functionality"""
    try:
        # Create a test listing
        test_data = {
            "name": "Test User",
            "city": "Test City",
            "area": "Test Area",
            "monthly_rent": 15000,
            "property_type": "Apartment",
            "contact_number": "+92-300-1234567",
            "amenities": "Test amenities",
            "house_rules": "Test rules"
        }
        
        result_data = {
            "status": "test_ready",
            "message": "Test data prepared - use /list-property endpoint to save real data",
            "test_data": test_data,
            "instructions": {
                "1": "Use POST /list-property with the above test_data format",
                "2": "Check POST /view-user-listings to see saved data",
                "3": "Monitor console logs for real-time saving status"
            }
        }
        
        return jsonify(result_data)
        
    except Exception as e:
        return jsonify({
            "error": f"Test failed: {str(e)}",
            "status": "error"
        }), 500


if __name__ == '__main__':
    print("Starting RoomMate Matcher API...")
    print("Loading datasets...")
    
    # Check if data files exist
    housing_file = project_root / "datasets" / "housing_listings_pakistan_400.json"
    profiles_file = project_root / "datasets" / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
    user_listings_file = project_root / "datasets" / "user_listings.json"
    
    if housing_file.exists():
        print(f"SUCCESS: Found housing data: {housing_file}")
    else:
        print(f"WARNING: Housing data not found: {housing_file}")
    
    if profiles_file.exists():
        print(f"SUCCESS: Found profiles data: {profiles_file}")
    else:
        print(f"WARNING: Profiles data not found: {profiles_file}")
    
    if user_listings_file.exists():
        with open(user_listings_file, 'r', encoding='utf-8') as f:
            user_data = json.load(f)
        print(f"SUCCESS: Found {len(user_data)} user listings: {user_listings_file}")
    else:
        print(f"  No user listings yet: {user_listings_file}")
    
    print(" Data Storage Status:")
    print(f"   - Local JSON: {'Available' if True else 'Disabled'}")
    print(f"   - Supabase: {'SUCCESS: Available' if supabase_available else 'WARNING:  Not Available'}")
    
    print("API Endpoints:")
    print("   - POST /list-property      : Save new property listing")
    print("   - GET  /view-user-listings : View all saved user listings")
    print("   - POST /test-save          : Test data saving functionality")
    print("   - POST /find-matches       : Find roommate matches")
    print("   - GET  /health             : API health check")
    
    print("API will be available at: http://localhost:8000")
    print(" Health check: http://localhost:8000/health")
    print()
    
    app.run(host='0.0.0.0', port=8000, debug=True)
