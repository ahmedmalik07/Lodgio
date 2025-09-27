import os
import sys
from google.adk.agents import LlmAgent

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file

red_flag_agent = LlmAgent(
    name="red_flag_agent",
    model="gemini-2.5-flash",
    instruction=load_instructions_file("agents/red_flag/instructions.txt"),
    description=load_instructions_file("agents/red_flag/description.txt"),
    output_key="red_flag_output"
)
