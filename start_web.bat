@echo off
echo Starting ADK Web Server for Roommate Matching System...
echo.
echo This will start the web interface at http://localhost:8000
echo Look for "roommate_matching_agent" in the agent dropdown
echo.
echo Press Ctrl+C to stop the server when done
echo.
uv run adk web ./agents