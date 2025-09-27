import os
import sys
from google.adk.agents import LlmAgent

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from utils.file_loader import load_instructions_file

wingman_agent = LlmAgent(
    name="wingman_agent",
    model="gemini-2.5-flash",
    instruction=load_instructions_file("agents/wingman/instructions.txt"),
    description=load_instructions_file("agents/wingman/description.txt"),
    output_key="wingman_output"
)
