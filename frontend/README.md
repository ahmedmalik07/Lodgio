# RoomMate Matcher - Next.js Frontend

A comprehensive Next.js frontend for the Google ADK Multi-Agent Roommate Matching System, designed specifically for Pakistani students.

## 🌟 Features

### For Roommate Seekers

- **Smart Profile Creation**: Multi-step form with lifestyle preferences
- **AI-Powered Matching**: Integration with Google ADK agent system
- **Real-time Agent Progress**: Watch AI agents analyze your profile
- **Detailed Match Results**: Compatibility scores, red flags, and wingman advice
- **Pakistani Context**: Urdu text support and local preferences

### For Property Providers

- **Comprehensive Listings**: Detailed property information forms
- **Amenity Selection**: Visual selection of available facilities
- **Rules & Preferences**: Set tenant preferences and house rules
- **Instant Publishing**: Properties go live immediately after submission

### Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI/UX**: Tailwind CSS with smooth animations
- **Multi-language**: English/Urdu mixed content support
- **Real-time Updates**: Live status updates during AI processing
- **Error Handling**: Comprehensive error management and user feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+ (for API backend)
- The main Google ADK multi-agent system

### Setup

1. **Install Frontend Dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**:

   ```bash
   pip install flask flask-cors
   ```

3. **Start the API Server**:

   ```bash
   python api_server.py
   ```

   The API will be available at `http://localhost:8000`

4. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Automated Setup

You can use the provided setup scripts:

**Windows**:

```bash
setup_frontend.bat
```

**Linux/Mac**:

```bash
chmod +x setup_frontend.sh
./setup_frontend.sh
```

## 🏗️ Architecture

### Frontend Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── seeker/           # Roommate seeker interface
│   ├── provider/         # Property provider interface
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Reusable components
├── public/              # Static assets
├── package.json         # Dependencies
└── tailwind.config.ts   # Styling configuration
```

### API Integration

- **`/find-matches`**: Connect seeker profiles with the agent system
- **`/list-property`**: Submit new property listings
- **`/get-listings`**: Fetch available properties
- **`/get-profiles`**: Fetch roommate profiles

## 🎨 Design System

### Color Scheme

- **Primary**: Blue gradient (`primary-50` to `primary-900`)
- **Secondary**: Pink gradient (`secondary-50` to `secondary-900`)
- **Accents**: Green for success, Red for warnings

### Typography

- **English**: Inter font family
- **Urdu**: Noto Nastaliq Urdu font family

### Components

- **Forms**: Multi-step with progress indicators
- **Cards**: Elevated with hover effects
- **Buttons**: Gradient backgrounds with animations
- **Animations**: Framer Motion for smooth transitions

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Configuration

The API server (`api_server.py`) connects the frontend with the existing Google ADK agent system:

- Integrates with `ClearRoommateMatcher` agent
- Loads data from JSON datasets
- Provides CORS support for frontend integration

## 📱 User Journey

### Seeker Flow

1. **Landing Page**: Choose "Find Roommate"
2. **Personal Info**: Name, location, budget
3. **Preferences**: Sleep schedule, cleanliness, study habits, food preferences
4. **AI Analysis**: Watch agents process the profile step-by-step
5. **Match Results**: View compatible roommates with detailed analysis

### Provider Flow

1. **Landing Page**: Choose "List My Room"
2. **Property Details**: Location, rent, room information
3. **Amenities**: Select available facilities and nearby locations
4. **Rules & Preferences**: Set tenant preferences and house rules
5. **Success**: Property listed and available to seekers

## 🤖 Agent Integration

The frontend integrates with the following agents from the main system:

- **Profile Reader**: Analyzes seeker profiles
- **Match Scorer**: Calculates compatibility scores
- **Red Flag Detector**: Identifies potential conflicts
- **Wingman Advisor**: Provides relationship advice
- **Room Hunter**: Searches for suitable accommodations

## 📊 Data Structure

### Seeker Profile

```json
{
  "name": "string",
  "city": "string",
  "area": "string",
  "budget_min": "number",
  "budget_max": "number",
  "sleep_schedule": "string",
  "cleanliness": "string",
  "noise_tolerance": "string",
  "study_habits": "string",
  "food_pref": "string",
  "additional_preferences": "string"
}
```

### Property Listing

```json
{
  "name": "string",
  "contact_number": "string",
  "city": "string",
  "area": "string",
  "property_type": "string",
  "monthly_rent": "number",
  "rooms_available": "number",
  "amenities": ["string"],
  "house_rules": "string",
  "preferred_tenant_type": "string"
}
```

## 🌏 Localization

The application supports Pakistani context with:

- **Cities**: Pre-populated list of major Pakistani cities
- **Currency**: PKR (Pakistani Rupees)
- **Culture**: Food preferences, lifestyle options specific to Pakistani students
- **Language**: Mixed English/Urdu interface elements

## 🚀 Deployment

### Frontend Deployment

The Next.js application can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any static hosting provider**

### API Deployment

The Flask API can be deployed to:

- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS/Azure/GCP**

### Build Commands

```bash
# Frontend build
cd frontend && npm run build

# API production
python api_server.py
```

## 🛠️ Development

### Adding New Features

1. **Frontend Components**: Add to `/components` directory
2. **New Pages**: Add to `/app` directory using App Router
3. **API Endpoints**: Add to `api_server.py`
4. **Styling**: Use Tailwind CSS classes

### Code Style

- **TypeScript**: Strict typing enabled
- **ESLint**: Configured for Next.js best practices
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS

## 📈 Performance

### Optimization Features

- **Next.js 14**: Latest performance improvements
- **Image Optimization**: Built-in Next.js image optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static asset caching

### Monitoring

- **Error Tracking**: Built-in error boundaries
- **Performance**: Web Vitals monitoring ready
- **Analytics**: Ready for integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Google ADK Multi-Agent System sample implementation.

## 🆘 Support

For issues and questions:

1. Check the main ADK system documentation
2. Review the API endpoints in `api_server.py`
3. Test with the health check endpoint: `http://localhost:8000/health`
4. Check browser console for frontend errors
5. Check terminal output for API errors
