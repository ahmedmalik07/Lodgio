# Data Storage Information

## 📊 Where Your Data Gets Stored

### **For Roommate Seekers** 🔍

- **Location**: `datasets/user_seekers.json`
- **What's Saved**:
  - Your profile information (name, city, area, budget)
  - Lifestyle preferences (sleep schedule, cleanliness, study habits)
  - Food preferences and additional requirements
  - Search timestamp
  - Number of matches found

### **For Property Providers** 🏠

- **Location**: `datasets/user_listings.json`
- **What's Saved**:
  - Property details (city, area, rent, type)
  - Contact information
  - Available amenities and facilities
  - House rules and preferences
  - Listing timestamp
  - Unique listing ID

### **Data Format Examples**

#### Seeker Profile Entry:

```json
{
  "id": "WEB-1234",
  "raw_profile_text": "Name: Ahmed Khan. Location: Karachi, Gulshan. Budget: 15000-25000 PKR...",
  "city": "Karachi",
  "area": "Gulshan-e-Iqbal",
  "budget_PKR": "15000-25000",
  "role": "seeker",
  "created_at": "2025-09-27 10:30:45",
  "search_results": 3
}
```

#### Property Listing Entry:

```json
{
  "listing_id": "PROP-5678",
  "city": "Lahore",
  "area": "DHA Phase 5",
  "monthly_rent_PKR": 20000,
  "rooms_available": 2,
  "property_type": "Apartment",
  "amenities": "Security Guard, CCTV, Generator",
  "contact_name": "Ali Ahmed",
  "contact_number": "+92 300 1234567",
  "created_at": "2025-09-27 10:35:22"
}
```

### **File Locations** 📁

```
project_root/
└── datasets/
    ├── user_seekers.json      ← Your roommate search profiles
    ├── user_listings.json     ← Your property listings
    ├── roommate_profiles_400.json    ← Sample data for matching
    └── housing_listings_400.json     ← Sample housing data
```

### **Data Persistence** 💾

- ✅ **Persistent**: Data survives server restarts
- ✅ **Searchable**: Can be loaded and searched by the system
- ✅ **Timestamped**: All entries include creation timestamps
- ✅ **Unique IDs**: Each entry has a unique identifier
- ✅ **JSON Format**: Human-readable and easily processable

### **Privacy & Security** 🔒

- Data is stored locally on your server
- No external data transmission (except to your own API)
- JSON files can be easily backed up or deleted
- No sensitive payment information is stored

### **Accessing Your Data** 📖

You can view your stored data by checking these files:

```bash
# View seeker profiles
cat datasets/user_seekers.json | jq .

# View property listings
cat datasets/user_listings.json | jq .

# Count total entries
wc -l datasets/user_*.json
```

### **API Endpoints for Data** 🔌

- `POST /find-matches` → Saves to `user_seekers.json`
- `POST /list-property` → Saves to `user_listings.json`
- `GET /get-listings` → Reads from both datasets
- `GET /get-profiles` → Reads seeker profiles

The data storage is fully functional and your information is being saved! 🎉
