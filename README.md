# Roomma## 🏠 Features

- ✅ **Sequential Multi-Agent Workflow:** A root agent orchestrates specialized agents:
  1. `profile_reader`: Parses messy Urdu/English roommate ads into structured data
  2. `match_scorer`: Calculates compatibility scores based on lifestyle factors
  3. `red_flag`: Detects serious lifestyle conflicts and safety concerns
  4. `wingman`: Provides transparent match explanations and compromise suggestions
  5. `room_hunter`: Finds suitable housing from 400+ available listings
- ✅ **Cultural Intelligence:** Handles mixed Urdu/English text and Pakistani student culture
- ✅ **Smart Matching:** Considers sleep schedule, cleanliness, study habits, noise tolerance, budget
- ✅ **Transparency:** Clear explanations for why matches work (or don't work)
- ✅ **Safety Focus:** Red flag detection for lifestyle conflicts and unsafe situations
- ✅ **Real Data:** 400 synthetic roommate profiles + 400 housing listings
- ✅ **Compromise Suggestions:** Practical advice for resolving compatibility issues System for Pakistani Students

This project demonstrates a multi-agent AI system using the Agent Development Kit (ADK) that helps Pakistani students find compatible roommates and suitable housing. The system processes messy, mixed Urdu/English roommate advertisements and uses sophisticated compatibility algorithms to make intelligent matches while considering cultural and social factors.

The system addresses the real problem of finding compatible roommates through unreliable Facebook groups and WhatsApp forwards by providing transparent, AI-powered matching with clear explanations.

---

## 📦 Features

- ✅ **Sequential Multi-Agent Workflow:** A root agent orchestrates a team of specialists:
  1.  `requirements_writer`: Clarifies the user's request.
  2.  `designer`: Plans the visual layout and structure.
  3.  `code_writer`: Generates the final HTML/CSS/JS code.
- ✅ Gemini-powered LLM agents using Google ADK.
- ✅ Takes a high-level natural language query (e.g., “build me a portfolio site”).
- ✅ Generates clean, complete HTML pages with inline CSS/JS.
- ✅ Saves the final output as a timestamped `.html` file.
- ✅ Highly modular and easily extendable.

---

## 📂 Project Structure

```text
roommate_matching_system/
├── agents/
│   ├── roommate_matcher_root/     # Orchestrator: Manages the agent sequence
│   │   ├── agent.py               # Main roommate matching coordinator
│   │   ├── instructions.txt
│   │   └── description.txt
│   ├── profile_reader/            # Agent 1: Parses messy roommate ads
│   │   ├── agent.py
│   │   ├── instructions.txt
│   │   └── description.txt
│   ├── match_scorer/              # Agent 2: Calculates compatibility scores
│   │   ├── agent.py
│   │   ├── instructions.txt
│   │   └── description.txt
│   ├── red_flag/                  # Agent 3: Detects lifestyle conflicts
│   │   ├── agent.py
│   │   ├── instructions.txt
│   │   └── description.txt
│   ├── wingman/                   # Agent 4: Explains matches & suggests compromises
│   │   ├── agent.py
│   │   ├── instructions.txt
│   │   └── description.txt
│   └── room_hunter/               # Agent 5: Finds suitable housing options
│       ├── agent.py
│       ├── instructions.txt
│       └── description.txt
├── datasets/
│   ├── synthetic_roommate_profiles_pakistan_400.json  # Sample student profiles
│   └── housing_listings_pakistan_400.json            # Available housing data
├── utils/
│   ├── file_loader.py             # Utility for reading instruction files
│   └── data_loader.py             # Dataset loading and filtering utilities
├── demo.py                        # Interactive demo showcasing system capabilities
├── agent_runner.py                # Main chat interface for the system
└── pyproject.toml                 # Project dependencies
```

---

## 🚀 Quickstart

### 1. Prerequisites

**Required:** Python 3.11+, uv, and Google AI API key.

### 2. Set Up Environment

```bash
cd adk_samples/version_2_sequential_website_agent
uv sync  # Install dependencies
```

### 3. Add Your API Key

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your-google-api-key
GOOGLE_GENAI_USE_VERTEXAI=FALSE
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Run the Demo

```bash
uv run python demo.py  # See system overview and sample data
```

### 5. Choose Your Interface

**🌐 Web Interface (Recommended):**

```bash
uv run adk web ./agents
# Then go to: http://localhost:8000
# Select: "roommate_matching_agent" from dropdown
```

**💬 Interactive Chat:**

```bash
uv run python agent_runner.py
```

**🚀 Quick Launcher:**

```bash
uv run python launcher.py  # Shows all options
```

---

## 🎯 Example Queries

Try these sample queries with the system:

```
Find me a roommate in Karachi with budget around 15k who is tidy and quiet

Match profile R-001 with compatible roommates and suggest housing options

I need a quiet roommate in Islamabad for online classes, budget max 20k

Compare profiles R-003 and R-010 for compatibility and red flags

Find housing in Lahore for two students with 25k combined budget
```

---

## 🧠 How It Works

The system uses a sequential multi-agent approach to solve roommate matching:

### Agent Flow:

1. **Profile Reader Agent**

   - Parses messy, mixed Urdu/English roommate ads
   - Extracts structured attributes (budget, cleanliness, sleep schedule, etc.)
   - Handles cultural context and Roman Urdu phrases

2. **Match Scorer Agent**

   - Calculates compatibility scores (0-100) between profiles
   - Weighs factors: sleep (25%), cleanliness (25%), noise (20%), study habits (15%), budget (15%)
   - Provides detailed score breakdown

3. **Red Flag Agent**

   - Detects serious lifestyle conflicts
   - Identifies safety concerns and cultural mismatches
   - Flags unrealistic expectations or suspicious profiles

4. **Wingman Agent**

   - Creates human-readable match explanations
   - Suggests practical compromises for compatibility issues
   - Provides conversation starters and success probability

5. **Room Hunter Agent**
   - Searches 400+ housing listings by location and budget
   - Matches amenities to student preferences
   - Considers cultural requirements (separate washrooms, etc.)

### Smart Features:

- **Cultural Intelligence:** Understands "tidy banda", "gandey bartan nahi", "tabla practice"
- **Budget Flexibility:** Handles "budget no issue" vs specific amounts
- **Safety First:** Red flags for "hosts frequent parties" vs "needs quiet"
- **Practical Solutions:** Suggests quiet hours, cleaning schedules, study arrangements

---

## 📊 Dataset Overview

### Roommate Profiles (400 entries)

```json
{
  "id": "R-001",
  "raw_profile_text": "Hostel seat available G-11, Islamabad. Budget no issue. Want Tidy banda, prefer Online classes, Quiet ok.",
  "city": "Islamabad",
  "area": "G-11",
  "budget_PKR": 13000,
  "sleep_schedule": "Night owl",
  "cleanliness": "Tidy",
  "noise_tolerance": "Quiet",
  "study_habits": "Online classes",
  "food_pref": "Flexible"
}
```

### Housing Listings (400 entries)

```json
{
  "listing_id": "H-0001",
  "city": "Multan",
  "area": "Gulgasht Colony",
  "monthly_rent_PKR": 14932,
  "rooms_available": 1,
  "amenities": ["WiFi", "Security guard", "Parking", "Mess facility"],
  "availability": "Available"
}
```

---

## 🎮 Running Methods

| Method               | Command                                       | Use Case                       |
| -------------------- | --------------------------------------------- | ------------------------------ |
| **Interactive Chat** | `uv run python agent_runner.py`               | Full conversation experience   |
| **Web UI**           | `uv run adk web ./agents`                     | Visual debugging interface     |
| **API Server**       | `uv run adk api_server ./agents`              | REST API integration           |
| **CLI Direct**       | `uv run adk run agents/roommate_matcher_root` | Single query testing           |
| **Quick Launcher**   | `uv run python launcher.py`                   | Choose interface interactively |

---

## 🔧 Technical Features

- **Multi-language Processing:** Handles English, Urdu, Roman Urdu seamlessly
- **Cultural Context:** Considers prayer times, family visits, Pakistani social norms
- **Scalable Architecture:** Easy to add new agents or modify scoring algorithms
- **Rich Output:** Detailed explanations with emojis and formatting
- **Safety Focused:** Comprehensive red flag detection for student safety

---

## 📈 Future Enhancements

- **Machine Learning Integration:** Train on real roommate success/failure data
- **Video Call Scheduling:** Integrate with calendar systems for virtual meetings
- **University Integration:** Connect with specific campus housing databases
- **Mobile App:** React Native interface for on-the-go matching
- **Feedback Loop:** Learn from successful/unsuccessful roommate pairs
- **Language Expansion:** Add support for more regional languages

---

## 🛠️ Extending the System

The modular design makes this project easy to extend:

- **Add Personality Matching:** Insert a `personality_analyzer` agent to assess compatibility beyond lifestyle factors
- **Video Chat Integration:** Add a `meeting_scheduler` agent to arrange virtual introductions
- **University Integration:** Connect with campus housing databases for official listings
- **Feedback System:** Add a `review_collector` agent to learn from successful/failed matches

---

## 📜 License

This repository is licensed under the **GNU General Public License v3.0**. See the `LICENSE` file for full details.

---

Happy roommate matching with ADK! 🏠🤝
