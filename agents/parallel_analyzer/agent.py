"""
File: agents/parallel_analyzer/agent.py
Purpose: Defines a ParallelAgent that runs match_scorer, red_flag, and wingman agents 
         concurrently to analyze roommate compatibility, detect issues, and provide 
         recommendations simultaneously. This dramatically reduces response time.

This parallel agent:
1. Receives structured profile data from profile_reader
2. Runs 3 analysis agents in parallel:
   - match_scorer: Finds compatible roommates
   - red_flag: Detects potential issues
   - wingman: Provides friendly recommendations
3. Outputs all analysis results for room_hunter to use
"""

import os
import sys
from google.adk.agents import ParallelAgent

# Add project root to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Import the individual analysis agents
from agents.match_scorer.agent import match_scorer_agent
from agents.red_flag.agent import red_flag_agent  
from agents.wingman.agent import wingman_agent

# Create the parallel analyzer that runs all three analysis agents concurrently
parallel_analyzer_agent = ParallelAgent(
    name="parallel_roommate_analyzer",
    # These three agents will run simultaneously instead of sequentially
    sub_agents=[
        match_scorer_agent,  # Finds compatible roommate matches
        red_flag_agent,  # Detects lifestyle conflicts and issues
        wingman_agent  # Provides user-friendly recommendations
    ],
    description="""
    Runs roommate compatibility analysis, red flag detection, and recommendation 
    generation in parallel for maximum speed. All three analysis perspectives 
    are processed simultaneously to provide comprehensive roommate matching results.
    """
)
