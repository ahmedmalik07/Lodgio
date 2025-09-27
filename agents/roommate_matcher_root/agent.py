import os
import sys
from google.adk.agents import SequentialAgent

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file
from agents.profile_reader.agent import profile_reader_agent
from agents.match_scorer.agent import match_scorer_agent
from agents.red_flag.agent import red_flag_agent
from agents.wingman.agent import wingman_agent
from agents.room_hunter.agent import room_hunter_agent

root_agent = SequentialAgent(
    name="roommate_matching_agent",
    sub_agents=[profile_reader_agent, match_scorer_agent, red_flag_agent, wingman_agent, room_hunter_agent],
    description=load_instructions_file("agents/roommate_matcher_root/description.txt")
)
