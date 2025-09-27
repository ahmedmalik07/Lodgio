import os
import sys
from google.adk.agents import LlmAgent

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from utils.data_loader import load_roommate_profiles, get_compatible_matches

match_scorer_agent = LlmAgent(
    name="match_scorer_agent",
    model="gemini-2.5-flash",
    instruction=load_instructions_file("agents/match_scorer/instructions.txt"),
    description=load_instructions_file("agents/match_scorer/description.txt"),
    output_key="match_scorer_output"
)
