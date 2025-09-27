#!/usr/bin/env python3
"""
Fixed Roommate Matching Agent with clear thought processes and data validation.
This version shows each agent's reasoning step-by-step and validates against real data.
"""

import os
import sys
from google.adk.agents import SequentialAgent

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file

# Import individual agents
from agents.profile_reader.agent import profile_reader_agent
from agents.match_scorer.agent import match_scorer_agent  
from agents.red_flag.agent import red_flag_agent
from agents.wingman.agent import wingman_agent
from agents.room_hunter.agent import room_hunter_agent

# Create a clear sequential agent with proper thought process display
clear_roommate_matcher = SequentialAgent(
    name="clear_roommate_matching_system",
    sub_agents=[
        profile_reader_agent,  # Step 1: Parse user input
        match_scorer_agent,  # Step 2: Find actual matches with data validation
        red_flag_agent,  # Step 3: Analyze potential issues  
        wingman_agent,  # Step 4: Provide friendly recommendations
        room_hunter_agent  # Step 5: Find housing options
    ],
    description="""
    📋 ROOMMATE MATCHING SYSTEM - CLEAR STEP-BY-STEP PROCESS

    This agent system processes roommate requests through 5 clear stages:
    
    🔍 STEP 1 - PROFILE READER: 
    Analyzes user input and creates structured profile data
    
    🎯 STEP 2 - MATCH SCORER:
    Searches the actual dataset for compatible roommates
    Validates all profile IDs against real data
    Shows compatibility scores and reasoning
    
    ⚠️  STEP 3 - RED FLAG ANALYZER:
    Reviews potential matches for lifestyle conflicts
    Identifies any concerning patterns or mismatches
    
    💡 STEP 4 - WINGMAN ADVISOR:
    Provides friendly, actionable recommendations
    Explains next steps and conversation starters
    
    🏠 STEP 5 - ROOM HUNTER:
    Finds suitable housing for user and recommended roommate
    Uses actual housing listing data
    
    Each agent shows its complete thought process and reasoning.
    All recommendations use ONLY real data from the datasets.
    """
)
