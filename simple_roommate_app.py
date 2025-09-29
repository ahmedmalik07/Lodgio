#!/usr/bin/env python3
"""
Simple Roommate Finder - Low Bandwidth Version

A lightweight, degraded but functional roommate search app for Pakistani cities.
Optimized for low bandwidth and simple deployment.

Author: Ahmed Malik  
Version: 1.2.0
Features:
- Fast city-based search
- Lightweight HTML interface
- REST API endpoints
- In-memory database for demo
"""

import os
import logging
from datetime import datetime

try:
    from flask import Flask, request, jsonify, render_template_string
    from flask_cors import CORS
except ImportError as e:
    print(f"CRITICAL: Flask dependencies not installed: {e}")
    print("Please run: pip install flask flask-cors")
    exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)

# CORS configuration
CORS(app, origins=["*"])  # Allow all origins for simple deployment

# App configuration
app.config.update(
    JSON_SORT_KEYS=False,
    JSONIFY_PRETTYPRINT_REGULAR=True
)


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "error": "Endpoint not found",
        "timestamp": datetime.now().isoformat()
    }), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "status": "error",
        "error": "Internal server error",
        "timestamp": datetime.now().isoformat()
    }), 500


# Simple in-memory database
ROOMMATES_DB = [
    {
        "id": "r001",
        "name": "Ahmed Khan",
        "city": "Lahore",
        "area": "DHA Phase 5",
        "budget": "15000-25000",
        "preferences": "Clean and organized person, early sleeper (10 PM), no smoking, prefers quiet study environment",
        "contact": "ahmed.dha@example.com | +92-300-1234567",
        "posted": "2025-09-25"
    },
    {
        "id": "r002",
        "name": "Fatima Ali",
        "city": "Karachi",
        "area": "Clifton Block 2",
        "budget": "20000-30000",
        "preferences": "Social but respectful, cooking allowed, flexible with timings, female roommate preferred",
        "contact": "fatima.clifton@example.com | +92-321-2345678",
        "posted": "2025-09-26"
    },
    {
        "id": "r003",
        "name": "Hassan Shah",
        "city": "Islamabad",
        "area": "F-7 Sector",
        "budget": "12000-20000",
        "preferences": "University student, needs study-friendly environment, budget-conscious, shared utilities",
        "contact": "hassan.f7@example.com | +92-333-3456789",
        "posted": "2025-09-27"
    },
    {
        "id": "r004",
        "name": "Ayesha Malik",
        "city": "Lahore",
        "area": "Gulberg III",
        "budget": "18000-28000",
        "preferences": "Female only, very neat and organized, working professional, prefers non-smoker",
        "contact": "ayesha.gulberg@example.com | +92-301-4567890",
        "posted": "2025-09-27"
    },
    {
        "id": "r005",
        "name": "Ali Raza",
        "city": "Karachi",
        "area": "North Nazimabad",
        "budget": "10000-18000",
        "preferences": "Budget-friendly option, shared kitchen facilities, friendly and easy-going personality",
        "contact": "ali.nazimabad@example.com | +92-322-5678901",
        "posted": "2025-09-28"
    },
    {
        "id": "r006",
        "name": "Zainab Hussain",
        "city": "Islamabad",
        "area": "G-11 Sector",
        "budget": "14000-22000",
        "preferences": "Female graduate student, quiet study hours, clean cooking habits, looking for like-minded person",
        "contact": "zainab.g11@example.com | +92-335-6789012",
        "posted": "2025-09-28"
    },
    {
        "id": "r007",
        "name": "Muhammad Tariq",
        "city": "Islamabad",
        "area": "G-9 Sector",
        "budget": "16000-24000",
        "preferences": "Working professional, quiet hours after 10 PM, prefers vegetarian meals, non-smoker",
        "contact": "tariq.g9@example.com | +92-340-7890123",
        "posted": "2025-09-28"
    },
    {
        "id": "r008",
        "name": "Sana Ahmed",
        "city": "Lahore",
        "area": "Johar Town",
        "budget": "13000-21000",
        "preferences": "Female medical student, needs quiet study space, early riser, health-conscious lifestyle",
        "contact": "sana.johar@example.com | +92-302-8901234",
        "posted": "2025-09-28"
    },
    {
        "id": "r009",
        "name": "Omar Malik",
        "city": "Karachi",
        "area": "Gulshan-e-Iqbal",
        "budget": "11000-19000",
        "preferences": "Engineering student, budget-friendly, shared internet and utilities, cricket enthusiast",
        "contact": "omar.gulshan@example.com | +92-323-9012345",
        "posted": "2025-09-28"
    },
    {
        "id": "r010",
        "name": "Mariam Khan",
        "city": "Islamabad",
        "area": "F-10 Sector",
        "budget": "17000-26000",
        "preferences": "Female IT professional, work from home friendly space, tech setup required, organized living",
        "contact": "mariam.f10@example.com | +92-336-0123456",
        "posted": "2025-09-28"
    }
]

# Simple HTML template for low bandwidth
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Roommate Finder - Pakistan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; color: #2c5aa0; }
        .search-box { margin-bottom: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px; }
        .search-box input, .search-box button { padding: 8px; margin: 5px; border: 1px solid #ccc; }
        .search-box button { background: #2c5aa0; color: white; cursor: pointer; border-radius: 4px; }
        .search-box button:hover { background: #1e3d72; }
        .roommate-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; background: #fff; }
        .roommate-card h3 { color: #2c5aa0; margin: 0 0 10px 0; }
        .detail { margin: 5px 0; }
        .contact { background: #f0f8ff; padding: 5px; border-radius: 3px; margin-top: 10px; }
        .no-results { text-align: center; color: #666; margin: 20px 0; }
        .stats { text-align: center; color: #666; margin: 10px 0; font-size: 0.9em; }
        .add-form { background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .add-form input, .add-form textarea { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ccc; box-sizing: border-box; }
        .success-msg { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Simple Roommate Finder</h1>
            <p>Find roommates in Pakistani cities - Low bandwidth version</p>
        </div>
        
        <div class="search-box">
            <h3>Search Roommates</h3>
            <input type="text" id="cityInput" placeholder="Enter city (Lahore, Karachi, Islamabad...)" />
            <input type="text" id="areaInput" placeholder="Area (optional)" />
            <input type="text" id="budgetInput" placeholder="Budget range (optional)" />
            <button onclick="searchRoommates()">Search</button>
            <button onclick="showAll()">Show All</button>
        </div>
        
        <div id="results">
            <div class="stats">Loading roommates...</div>
        </div>
        
        <div class="add-form">
            <h3>📝 Add Your Profile</h3>
            <input type="text" id="newName" placeholder="Your name" />
            <input type="text" id="newCity" placeholder="City" />
            <input type="text" id="newArea" placeholder="Area" />
            <input type="text" id="newBudget" placeholder="Budget range (e.g., 15000-25000)" />
            <input type="text" id="newContact" placeholder="Contact (email/phone)" />
            <textarea id="newPreferences" placeholder="Preferences (clean, quiet, etc.)" rows="3"></textarea>
            <button onclick="addRoommate()">Add My Profile</button>
        </div>
        
        <div id="addResult"></div>
    </div>

    <script>
        let allRoommates = [];
        
        // Load all roommates on page load
        window.onload = function() {
            showAll();
        };
        
        function showAll() {
            fetch('/api/roommates')
                .then(response => response.json())
                .then(data => {
                    allRoommates = data.roommates;
                    displayRoommates(allRoommates);
                })
                .catch(error => {
                    document.getElementById('results').innerHTML = '<div class="no-results">Error loading data. Please try again.</div>';
                });
        }
        
        function searchRoommates() {
            const city = document.getElementById('cityInput').value.trim();
            const area = document.getElementById('areaInput').value.trim();
            const budget = document.getElementById('budgetInput').value.trim();
            
            if (!city) {
                alert('Please enter a city to search');
                return;
            }
            
            const params = new URLSearchParams();
            if (city) params.append('city', city);
            if (area) params.append('area', area);
            if (budget) params.append('budget', budget);
            
            fetch(`/api/search?${params}`)
                .then(response => response.json())
                .then(data => {
                    displayRoommates(data.roommates);
                })
                .catch(error => {
                    document.getElementById('results').innerHTML = '<div class="no-results">Search failed. Please try again.</div>';
                });
        }
        
        function displayRoommates(roommates) {
            const resultsDiv = document.getElementById('results');
            
            if (roommates.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">No roommates found. Try different search terms.</div>';
                return;
            }
            
            let html = `<div class="stats">Found ${roommates.length} roommate(s)</div>`;
            
            roommates.forEach(roommate => {
                html += `
                    <div class="roommate-card">
                        <h3>${roommate.name} - ${roommate.city}</h3>
                        <div class="detail"><strong>Area:</strong> ${roommate.area}</div>
                        <div class="detail"><strong>Budget:</strong> PKR ${roommate.budget}</div>
                        <div class="detail"><strong>Preferences:</strong> ${roommate.preferences}</div>
                        <div class="detail"><strong>Posted:</strong> ${roommate.posted}</div>
                        <div class="contact"><strong>Contact:</strong> ${roommate.contact}</div>
                    </div>
                `;
            });
            
            resultsDiv.innerHTML = html;
        }
        
        function addRoommate() {
            const name = document.getElementById('newName').value.trim();
            const city = document.getElementById('newCity').value.trim();
            const area = document.getElementById('newArea').value.trim();
            const budget = document.getElementById('newBudget').value.trim();
            const contact = document.getElementById('newContact').value.trim();
            const preferences = document.getElementById('newPreferences').value.trim();
            
            if (!name || !city || !contact) {
                alert('Please fill in name, city, and contact fields');
                return;
            }
            
            const newRoommate = {
                name: name,
                city: city,
                area: area || 'Not specified',
                budget: budget || 'Negotiable',
                contact: contact,
                preferences: preferences || 'No specific preferences'
            };
            
            fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoommate)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('addResult').innerHTML = 
                        '<div class="success-msg">✅ Profile added successfully! Refreshing list...</div>';
                    
                    // Clear form
                    document.getElementById('newName').value = '';
                    document.getElementById('newCity').value = '';
                    document.getElementById('newArea').value = '';
                    document.getElementById('newBudget').value = '';
                    document.getElementById('newContact').value = '';
                    document.getElementById('newPreferences').value = '';
                    
                    // Refresh list
                    setTimeout(() => {
                        showAll();
                        document.getElementById('addResult').innerHTML = '';
                    }, 2000);
                } else {
                    document.getElementById('addResult').innerHTML = 
                        '<div class="no-results">Failed to add profile. Please try again.</div>';
                }
            })
            .catch(error => {
                document.getElementById('addResult').innerHTML = 
                    '<div class="no-results">Error adding profile. Please try again.</div>';
            });
        }
    </script>
</body>
</html>
"""


@app.route('/')
def index():
    """Main page - simple HTML interface"""
    return render_template_string(HTML_TEMPLATE)


@app.route('/api/roommates')
def get_all_roommates():
    """Get all roommates"""
    return jsonify({
        "success": True,
        "roommates": ROOMMATES_DB,
        "total": len(ROOMMATES_DB)
    })


@app.route('/api/search')
def search_roommates():
    """Search roommates by city, area, budget"""
    city = request.args.get('city', '').lower()
    area = request.args.get('area', '').lower()
    budget = request.args.get('budget', '').lower()
    
    results = []
    
    for roommate in ROOMMATES_DB:
        # City filter (required)
        if city and city not in roommate['city'].lower():
            continue
            
        # Area filter (optional)
        if area and area not in roommate['area'].lower():
            continue
            
        # Budget filter (optional - simple string matching)
        if budget and budget not in roommate['budget'].lower():
            continue
            
        results.append(roommate)
    
    return jsonify({
        "success": True,
        "roommates": results,
        "total": len(results),
        "query": {"city": city, "area": area, "budget": budget}
    })


@app.route('/api/add', methods=['POST'])
def add_roommate():
    """Add a new roommate profile"""
    try:
        data = request.get_json()
        
        # Generate new ID
        new_id = f"r{str(len(ROOMMATES_DB) + 1).zfill(3)}"
        
        # Create new roommate entry
        new_roommate = {
            "id": new_id,
            "name": data.get('name', 'Anonymous'),
            "city": data.get('city', 'Unknown'),
            "area": data.get('area', 'Not specified'),
            "budget": data.get('budget', 'Negotiable'),
            "preferences": data.get('preferences', 'No specific preferences'),
            "contact": data.get('contact', 'No contact provided'),
            "posted": datetime.now().strftime('%Y-%m-%d')
        }
        
        # Add to database
        ROOMMATES_DB.append(new_roommate)
        
        return jsonify({
            "success": True,
            "message": "Roommate profile added successfully",
            "id": new_id
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route('/health')
def health_check():
    """Simple health check"""
    return jsonify({
        "status": "healthy",
        "service": "Simple Roommate Finder",
        "total_profiles": len(ROOMMATES_DB),
        "timestamp": datetime.now().isoformat()
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"🏠 Simple Roommate Finder starting on port {port}")
    print(f"📊 Loaded {len(ROOMMATES_DB)} initial profiles")
    print(f"🌐 Visit: http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=True)
