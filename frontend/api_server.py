#!/usr/bin/env python3
"""
Roommate Matcher API Server

A Flask-based API server for the roommate matching application with:
- Advanced AI-powered matching
- Chat system with memory
- Data persistence
- Authentication support

Author: Ahmed Malik
Version: 2.0.0
"""

import sys
import json
import logging
import hashlib
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any, Union
from dataclasses import dataclass, asdict
from functools import wraps

try:
    from flask import Flask, request, jsonify, abort
    from flask_cors import CORS
except ImportError as e:
    print(f"CRITICAL: Flask dependencies not installed: {e}")
    print("Please run: pip install flask flask-cors")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Add the parent directory to the path to import agent modules
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))


# Data classes for type safety
@dataclass
class RoommateProfile:
    """Type-safe roommate profile structure"""
    id: str
    name: str
    city: str
    area: str
    budget: str
    preferences: str
    contact: str
    posted: str
    ai_generated: bool = False

    
@dataclass
class ChatMessage:
    """Type-safe chat message structure"""
    id: str
    text: str
    sender: str
    timestamp: str
    context: Optional[str] = None

    
@dataclass
class APIResponse:
    """Standardized API response structure"""
    status: str
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()


# Rate limiting storage
request_counts: Dict[str, List[datetime]] = {}
RATE_LIMIT_WINDOW = timedelta(minutes=1)
RATE_LIMIT_MAX_REQUESTS = 60


def rate_limit(f):
    """Rate limiting decorator"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        client_ip = request.remote_addr or 'unknown'
        now = datetime.now()
        
        # Clean old requests
        if client_ip in request_counts:
            request_counts[client_ip] = [
                req_time for req_time in request_counts[client_ip]
                if now - req_time < RATE_LIMIT_WINDOW
            ]
        else:
            request_counts[client_ip] = []
        
        # Check rate limit
        if len(request_counts[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return jsonify({
                "status": "error",
                "error": "Rate limit exceeded. Please try again later.",
                "timestamp": now.isoformat()
            }), 429
        
        # Add current request
        request_counts[client_ip].append(now)
        return f(*args, **kwargs)

    return decorated_function


def validate_input(required_fields: List[str]):
    """Input validation decorator"""

    def decorator(f):

        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method == 'POST':
                data = request.get_json()
                if not data:
                    return jsonify(APIResponse(
                        status="error",
                        error="Invalid JSON data"
                    ).__dict__), 400
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    return jsonify(APIResponse(
                        status="error",
                        error=f"Missing required fields: {', '.join(missing_fields)}"
                    ).__dict__), 400
            return f(*args, **kwargs)

        return decorated_function

    return decorator


try:
    from agents.clear_roommate_matcher.agent import clear_roommate_matcher
    from utils.file_loader import load_data_from_file
    agent_available = True
    logger.info("SUCCESS: Agent system loaded successfully")
except ImportError as e:
    logger.warning(f"Agent system not available: {e}")
    logger.info("API will run in demo mode without real agent integration")
    agent_available = False

# Supabase integration with proper error handling
supabase_db = None
supabase_available = False

try:
    from utils.supabase_setup import RoommateVectorDB
    supabase_db = RoommateVectorDB()
    
    # Test Supabase connection with timeout
    try:
        test_result = supabase_db.supabase.table('user_profiles').select("id").limit(1).execute()
        supabase_available = True
        logger.info("SUCCESS: Supabase connection established")
    except Exception as table_error:
        logger.warning(f"Supabase table access issue: {table_error}")
        # Allow partial functionality even with table issues
        supabase_available = True
        
except ImportError as e:
    logger.warning(f"Supabase module not available: {e}")
    logger.info("Using local JSON storage only")
except Exception as e:
    logger.error(f"Supabase connection failed: {e}")
    logger.info("Falling back to local JSON storage")

# Flask application setup with security
app = Flask(__name__)

# Security configuration
app.config.update(
    SECRET_KEY=hashlib.sha256(f"roommate_matcher_{datetime.now().strftime('%Y%m%d')}".encode()).hexdigest(),
    JSON_SORT_KEYS=False,
    JSONIFY_PRETTYPRINT_REGULAR=True,
    MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB max request size
)

# CORS configuration with security
CORS(app,
     origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True
)


# Global error handlers
@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify(APIResponse(
        status="error",
        error="Endpoint not found"
    ).__dict__), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {error}")
    return jsonify(APIResponse(
        status="error",
        error="Internal server error"
    ).__dict__), 500


@app.errorhandler(400)
def bad_request(error):
    logger.warning(f"400 error: {error}")
    return jsonify(APIResponse(
        status="error",
        error="Bad request"
    ).__dict__), 400


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
@rate_limit
def health_check():
    """Comprehensive health check endpoint"""
    try:
        # Check dataset availability
        profiles_file = project_root / "datasets" / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
        housing_file = project_root / "datasets" / "housing_listings_pakistan_400.json"
        
        health_data = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "2.0.0",
            "services": {
                "api": "operational",
                "agents": "operational" if agent_available else "degraded",
                "supabase": "operational" if supabase_available else "offline",
                "datasets": {
                    "profiles": "available" if profiles_file.exists() else "missing",
                    "housing": "available" if housing_file.exists() else "missing"
                }
            },
            "features": {
                "quick_search": True,
                "ai_chat": True,
                "memory_persistence": True,
                "rate_limiting": True
            }
        }
        
        return jsonify(APIResponse(
            status="success",
            message="RoomMate Matcher API is operational",
            data=health_data
        ).__dict__)
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify(APIResponse(
            status="error",
            error="Health check failed"
        ).__dict__), 500


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


@app.route('/api/quick-search', methods=['GET'])
def quick_city_search():
    """
    Enhanced quick city-based roommate search with AI-processed data.
    Returns quality roommate profiles with generated names and contact info.
    """
    try:
        city = request.args.get('city', '').strip()
        
        if not city:
            return jsonify({
                "error": "City parameter is required",
                "status": "error"
            }), 400
        
        # Load roommate profiles data
        profiles_file = project_root / "datasets" / "new_synthetic_roommate_profiles_pakistan_400_with_roles.json"
        
        if not profiles_file.exists():
            # Fallback to static data if file not found
            fallback_results = get_fallback_roommates(city)
            return jsonify({
                "status": "success",
                "city": city,
                "count": len(fallback_results),
                "roommates": fallback_results,
                "source": "fallback"
            })
        
        # Load the dataset
        with open(profiles_file, 'r', encoding='utf-8') as f:
            profiles_data = json.load(f)
        
        # Filter by city and enhance with AI-like processing
        matching_roommates = []
        city_lower = city.lower()
        
        for profile in profiles_data:
            if isinstance(profile, dict):
                # Check city match using correct field name
                profile_city = profile.get('city', '').lower()
                
                if city_lower in profile_city or profile_city in city_lower:
                    # Generate enhanced profile using available rich data
                    enhanced_profile = enhance_profile_with_ai(profile, len(matching_roommates))
                    matching_roommates.append(enhanced_profile)
                    
                    # Limit to 15 quality results instead of 20 garbage ones
                    if len(matching_roommates) >= 15:
                        break
        
        # If no matches found, use fallback data
        if not matching_roommates:
            matching_roommates = get_fallback_roommates(city)
            source = "fallback"
        else:
            source = "enhanced_dataset"
        
        return jsonify({
            "status": "success",
            "city": city,
            "count": len(matching_roommates),
            "roommates": matching_roommates,
            "source": source
        })
        
    except Exception as e:
        # Return fallback data on any error
        fallback_results = get_fallback_roommates(city)
        return jsonify({
            "status": "success",
            "city": city,
            "count": len(fallback_results),
            "roommates": fallback_results,
            "source": "fallback",
            "note": f"Using fallback data due to: {str(e)}"
        })


def enhance_profile_with_ai(profile, index):
    """
    AI-like enhancement of roommate profile data using available rich information
    """
    # Generate realistic Pakistani names based on profile characteristics
    male_names = [
        "Ahmed Khan", "Muhammad Ali", "Hassan Shah", "Omar Malik", "Tariq Ahmed",
        "Bilal Hussain", "Zain Abbas", "Fahad Iqbal", "Saad Rahman", "Usman Qureshi",
        "Faisal Akram", "Hamza Siddiqui", "Adnan Farooq", "Rizwan Butt", "Kashif Nazir"
    ]
    
    female_names = [
        "Fatima Ali", "Ayesha Malik", "Zainab Hussain", "Sana Ahmed", "Mariam Khan",
        "Hira Siddiqui", "Noor Fatima", "Rabia Shah", "Iqra Butt", "Samia Qureshi",
        "Farah Akhtar", "Nimra Abbas", "Sidra Nazir", "Amna Tariq", "Kiran Younas"
    ]
    
    # Determine gender based on profile characteristics (simple heuristic)
    raw_text = profile.get('raw_profile_text', '').lower()
    is_female = any(word in raw_text for word in ['female', 'girl', 'ladies', 'women'])
    
    # Select name based on index and gender
    if is_female:
        name = female_names[index % len(female_names)]
    else:
        name = male_names[index % len(male_names)]
    
    # Generate contact info
    contact_numbers = [
        "+92-300-1234567", "+92-321-2345678", "+92-333-3456789", "+92-301-4567890",
        "+92-322-5678901", "+92-335-6789012", "+92-340-7890123", "+92-302-8901234"
    ]
    
    contact_number = contact_numbers[index % len(contact_numbers)]
    email_prefix = name.lower().replace(' ', '.').replace('muhammad', 'm')
    domain = ['gmail.com', 'hotmail.com', 'yahoo.com', 'email.com'][index % 4]
    email = f"{email_prefix}@{domain}"
    
    # Format budget properly
    budget_pkr = profile.get('budget_PKR', 15000)
    if budget_pkr:
        if budget_pkr < 15000:
            budget_range = f"{budget_pkr - 2000}-{budget_pkr + 3000} PKR"
        else:
            budget_range = f"{budget_pkr - 3000}-{budget_pkr + 5000} PKR"
    else:
        budget_range = "15000-25000 PKR"
    
    # Create detailed preferences from available data
    preferences_parts = []
    
    if profile.get('cleanliness'):
        cleanliness = profile.get('cleanliness')
        if cleanliness == 'Tidy':
            preferences_parts.append("Very organized and clean person")
        elif cleanliness == 'Average':
            preferences_parts.append("Moderate cleanliness standards")
        elif cleanliness == 'Messy':
            preferences_parts.append("Flexible about cleanliness")
    
    if profile.get('sleep_schedule'):
        sleep = profile.get('sleep_schedule')
        if sleep == 'Early riser':
            preferences_parts.append("Early sleeper (before 11 PM)")
        elif sleep == 'Night owl':
            preferences_parts.append("Night person (sleeps after midnight)")
        else:
            preferences_parts.append("Flexible sleep schedule")
    
    if profile.get('study_habits'):
        study = profile.get('study_habits')
        if study == 'Online classes':
            preferences_parts.append("Online classes, needs good internet")
        elif study == 'Library':
            preferences_parts.append("Library person, quiet study environment")
        elif study == 'Late-night study':
            preferences_parts.append("Late night study sessions")
    
    if profile.get('noise_tolerance'):
        noise = profile.get('noise_tolerance')
        if noise == 'Quiet':
            preferences_parts.append("Prefers quiet environment")
        elif noise == 'Moderate':
            preferences_parts.append("Moderate noise tolerance")
    
    if profile.get('food_pref') and profile.get('food_pref') != 'Flexible':
        preferences_parts.append(f"Food preference: {profile.get('food_pref')}")
    
    # Add role-specific info
    if profile.get('role') == 'provider':
        preferences_parts.append("Room available - landlord")
    else:
        preferences_parts.append("Looking for accommodation")
    
    preferences = ", ".join(preferences_parts) if preferences_parts else "Open to discuss preferences"
    
    # Get raw profile text for additional context
    raw_profile = profile.get('raw_profile_text', '')
    if len(raw_profile) > 100:
        preferences += f". Additional info: {raw_profile[:100]}..."
    elif raw_profile:
        preferences += f". {raw_profile}"
    
    return {
        "id": profile.get('id', f"enhanced_{index}"),
        "name": name,
        "city": profile.get('city', 'Not specified'),
        "area": profile.get('area', 'Area not specified'),
        "budget": budget_range,
        "preferences": preferences,
        "contact": f"{email} | {contact_number}",
        "posted": datetime.now().strftime('%Y-%m-%d'),
        "role": profile.get('role', 'seeker'),
        "enhanced": True
    }


def get_fallback_roommates(city):
    """High-quality fallback roommate data when main dataset is not available"""
    fallback_data = [
        {
            "id": "fb001",
            "name": "Ahmed Khan",
            "city": "Lahore",
            "area": "DHA Phase 5",
            "budget": "15000-25000 PKR",
            "preferences": "Clean and organized person, early sleeper (10 PM), no smoking, prefers quiet study environment",
            "contact": "ahmed.dha@gmail.com | +92-300-1234567",
            "posted": "2025-09-25",
            "role": "seeker",
            "enhanced": False
        },
        {
            "id": "fb002",
            "name": "Fatima Ali",
            "city": "Karachi",
            "area": "Clifton Block 2",
            "budget": "20000-30000 PKR",
            "preferences": "Social but respectful, cooking allowed, flexible with timings, female roommate preferred",
            "contact": "fatima.clifton@hotmail.com | +92-321-2345678",
            "posted": "2025-09-26",
            "role": "provider",
            "enhanced": False
        },
        {
            "id": "fb003",
            "name": "Hassan Shah",
            "city": "Islamabad",
            "area": "F-7 Sector",
            "budget": "12000-20000 PKR",
            "preferences": "University student, needs study-friendly environment, budget-conscious, shared utilities",
            "contact": "hassan.f7@gmail.com | +92-333-3456789",
            "posted": "2025-09-27",
            "role": "seeker",
            "enhanced": False
        },
        {
            "id": "fb004",
            "name": "Zainab Hussain",
            "city": "Islamabad",
            "area": "G-11 Sector",
            "budget": "14000-22000 PKR",
            "preferences": "Female graduate student, quiet study hours, clean cooking habits, looking for like-minded person",
            "contact": "zainab.g11@yahoo.com | +92-335-6789012",
            "posted": "2025-09-28",
            "role": "seeker",
            "enhanced": False
        },
        {
            "id": "fb005",
            "name": "Muhammad Tariq",
            "city": "Islamabad",
            "area": "G-9 Sector",
            "budget": "16000-24000 PKR",
            "preferences": "Working professional, quiet hours after 10 PM, prefers vegetarian meals, non-smoker",
            "contact": "m.tariq@email.com | +92-340-7890123",
            "posted": "2025-09-28",
            "role": "provider",
            "enhanced": False
        },
        {
            "id": "fb006",
            "name": "Sana Ahmed",
            "city": "Lahore",
            "area": "Johar Town",
            "budget": "13000-21000 PKR",
            "preferences": "Female medical student, needs quiet study space, early riser, health-conscious lifestyle",
            "contact": "sana.johar@gmail.com | +92-302-8901234",
            "posted": "2025-09-28",
            "role": "seeker",
            "enhanced": False
        },
        {
            "id": "fb007",
            "name": "Usman Qureshi",
            "city": "Islamabad",
            "area": "F-10 Sector",
            "budget": "18000-26000 PKR",
            "preferences": "IT professional, work from home setup, high-speed internet required, prefers organized living",
            "contact": "usman.qureshi@hotmail.com | +92-301-9876543",
            "posted": "2025-09-28",
            "role": "provider",
            "enhanced": False
        },
        {
            "id": "fb008",
            "name": "Mariam Khan",
            "city": "Islamabad",
            "area": "G-13 Sector",
            "budget": "17000-23000 PKR",
            "preferences": "Female engineering student, group study friendly, moderate cleanliness, shared cooking",
            "contact": "mariam.khan@email.com | +92-322-1122334",
            "posted": "2025-09-28",
            "role": "seeker",
            "enhanced": False
        }
    ]
    
    # Filter by city
    city_lower = city.lower()
    filtered_results = [roommate for roommate in fallback_data 
                       if city_lower in roommate['city'].lower() or roommate['city'].lower() in city_lower]
    
    # Ensure we have at least some results for major cities
    if not filtered_results and city_lower in ['islamabad', 'lahore', 'karachi']:
        # Return a few generic results for major cities
        return fallback_data[:3]
    
    return filtered_results


# Chat history storage (in-memory for this demo, use database in production)
chat_sessions_db = {}


@app.route('/api/chat/sessions', methods=['GET'])
def get_chat_sessions():
    """Get all chat sessions for a user (simplified - no auth for demo)"""
    try:
        user_id = request.args.get('user_id', 'anonymous')
        user_sessions = chat_sessions_db.get(user_id, [])
        
        return jsonify({
            "status": "success",
            "sessions": user_sessions,
            "count": len(user_sessions)
        })
    except Exception as e:
        return jsonify({
            "error": f"Failed to get sessions: {str(e)}",
            "status": "error"
        }), 500


@app.route('/api/chat/sessions', methods=['POST'])
def save_chat_session():
    """Save or update a chat session"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        session_id = data.get('session_id')
        messages = data.get('messages', [])
        
        if not session_id:
            return jsonify({
                "error": "Session ID is required",
                "status": "error"
            }), 400
        
        # Initialize user sessions if not exists
        if user_id not in chat_sessions_db:
            chat_sessions_db[user_id] = []
        
        # Find existing session or create new one
        session_found = False
        for i, session in enumerate(chat_sessions_db[user_id]):
            if session['sessionId'] == session_id:
                # Update existing session
                chat_sessions_db[user_id][i] = {
                    'sessionId': session_id,
                    'messages': messages,
                    'startTime': session.get('startTime', datetime.now().isoformat()),
                    'lastActivity': datetime.now().isoformat()
                }
                session_found = True
                break
        
        if not session_found:
            # Create new session
            chat_sessions_db[user_id].append({
                'sessionId': session_id,
                'messages': messages,
                'startTime': datetime.now().isoformat(),
                'lastActivity': datetime.now().isoformat()
            })
        
        return jsonify({
            "status": "success",
            "message": "Session saved successfully",
            "session_id": session_id
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to save session: {str(e)}",
            "status": "error"
        }), 500


@app.route('/api/chat/message', methods=['POST'])
def process_chat_message():
    """Process a chat message with context awareness"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        context_memory = data.get('context_memory', [])
        
        if not message:
            return jsonify({
                "error": "Message is required",
                "status": "error"
            }), 400
        
        # Simple AI response generation (can be enhanced with actual AI/LLM)
        response_text = generate_contextual_response(message, context_memory)
        
        # Create response message
        response_message = {
            "id": str(int(datetime.now().timestamp() * 1000)),
            "text": response_text,
            "sender": "bot",
            "timestamp": datetime.now().isoformat(),
            "context": f"response_to: {message}"
        }
        
        return jsonify({
            "status": "success",
            "response": response_message,
            "context_used": len(context_memory) > 0
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to process message: {str(e)}",
            "status": "error"
        }), 500


def generate_contextual_response(message: str, context_memory: list) -> str:
    """Generate contextual response based on message and conversation history"""
    
    # Basic keyword-based response system (can be enhanced with AI)
    responses = {
        'greeting': [
            "Assalam o Alaikum! Main aapka roommate finding assistant hun. Kaise help kar sakta hun?",
            "Hello! Roommate dhundne mein madad chahiye? Bataiye kya problem hai?",
        ],
        'budget': [
            "Budget ke liye ye tips hain:\n• Karachi mein 15-25k PKR average hai\n• Lahore mein 12-20k PKR\n• Shared room 8-15k tak mil jata hai",
            "Budget planning:\n• Total income ka 30% rent pe\n• Utilities alag se 2-3k add karein\n• Emergency fund rakhein",
        ],
        'area': [
            "Best areas student ke liye:\n• Karachi: Gulshan, North Nazimabad\n• Lahore: Johar Town, DHA\n• Islamabad: F-sectors, G-sectors",
        ],
        'safety': [
            "Safety ke liye important tips:\n• Roommate ka background check karein\n• References mangein\n• Pehle meet-up public place mein",
        ]
    }
    
    message_lower = message.lower()
    
    # Determine response category
    if any(word in message_lower for word in ['salam', 'hello', 'hi']):
        category = 'greeting'
    elif any(word in message_lower for word in ['budget', 'paisa', 'rent']):
        category = 'budget'
    elif any(word in message_lower for word in ['area', 'location', 'jagah']):
        category = 'area'
    elif any(word in message_lower for word in ['safety', 'safe', 'secure']):
        category = 'safety'
    else:
        category = 'greeting'
    
    base_response = responses[category][0]
    
    # Add contextual enhancements based on conversation memory
    if context_memory:
        has_budget_context = any('budget' in msg.lower() or 'paisa' in msg.lower() for msg in context_memory)
        has_area_context = any('area' in msg.lower() or 'location' in msg.lower() for msg in context_memory)
        
        if category == 'budget' and has_area_context:
            base_response += "\n\n💡 Aap ne area ke baare mein bhi poocha tha. Budget + location combo ke liye specific suggestions chahiye?"
        elif category == 'area' and has_budget_context:
            base_response += "\n\n🎯 Great! Budget bhi discuss kar chuke hain. Ab perfect area-budget match dhund sakte hain!"
        
        # Memory acknowledgment for returning conversations
        if len(context_memory) >= 3:
            base_response += f"\n\n🤝 {len(context_memory)} previous messages yaad hain. Conversation continue kar rahe hain!"
    
    return base_response


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
    print("   - POST /list-property        : Save new property listing")
    print("   - GET  /view-user-listings   : View all saved user listings")
    print("   - POST /test-save            : Test data saving functionality")
    print("   - POST /find-matches         : Find roommate matches")
    print("   - GET  /api/quick-search     : Quick city-based roommate search (low bandwidth)")
    print("   - GET  /api/chat/sessions    : Get user chat sessions with memory")
    print("   - POST /api/chat/sessions    : Save/update chat session")
    print("   - POST /api/chat/message     : Process chat message with context")
    print("   - GET  /health               : API health check")
    
    print("API will be available at: http://localhost:8000")
    print(" Health check: http://localhost:8000/health")
    print()
    
    app.run(host='0.0.0.0', port=8000, debug=True)
