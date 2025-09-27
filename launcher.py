#!/usr/bin/env python3
"""
Alternative ways to run the Roommate Matching System
Choose the method that works best for your setup
"""

import subprocess


def show_options():
    print("🏠 Roommate Matching System - Launch Options\n")
    
    print("Choose how you want to run the system:\n")
    
    print("1️⃣  ADK Web Interface (Recommended)")
    print("   Command: uv run adk web ./agents")
    print("   Access: http://localhost:8000")
    print("   Look for: 'roommate_matching_agent' in dropdown\n")
    
    print("2️⃣  Interactive Chat")
    print("   Command: uv run python agent_runner.py")
    print("   Type your queries directly\n")
    
    print("3️⃣  API Server") 
    print("   Command: uv run adk api_server ./agents")
    print("   For programmatic access\n")
    
    print("4️⃣  Direct Agent Run")
    print("   Command: uv run adk run agents/roommate_matcher_root")
    print("   Single query execution\n")
    
    print("5️⃣  Demo Mode")
    print("   Command: uv run python demo.py")
    print("   See system overview and sample data\n")


def run_web_server():
    print("🚀 Starting ADK Web Server...")
    print("Access at: http://localhost:8000")
    print("Look for: 'roommate_matching_agent'")
    print("\nPress Ctrl+C to stop\n")
    
    try:
        subprocess.run(["uv", "run", "adk", "web", "./agents"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting web server: {e}")
    except KeyboardInterrupt:
        print("\n✅ Web server stopped")


def run_chat():
    print("🗨️  Starting Interactive Chat...")
    try:
        subprocess.run(["uv", "run", "python", "agent_runner.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting chat: {e}")
    except KeyboardInterrupt:
        print("\n✅ Chat stopped")


def main():
    show_options()
    
    while True:
        choice = input("Select option (1-5) or 'q' to quit: ").strip()
        
        if choice == 'q':
            break
        elif choice == '1':
            run_web_server()
            break
        elif choice == '2':
            run_chat()
            break
        elif choice == '3':
            print("Starting API server...")
            subprocess.run(["uv", "run", "adk", "api_server", "./agents"])
            break
        elif choice == '4':
            print("Running direct agent...")
            subprocess.run(["uv", "run", "adk", "run", "agents/roommate_matcher_root"])
            break
        elif choice == '5':
            subprocess.run(["uv", "run", "python", "demo.py"])
            break
        else:
            print("Invalid choice. Please select 1-5 or 'q'")


if __name__ == "__main__":
    main()
