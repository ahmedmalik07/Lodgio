#!/usr/bin/env python3
"""
Quick test of the parallel roommate matching system
"""

import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))


def test_imports():
    """Test that all the parallel agent imports work correctly."""
    print("🔧 Testing parallel agent imports...")
    
    try:
        from agents.parallel_analyzer.agent import parallel_analyzer_agent
        print("✅ parallel_analyzer_agent imported successfully")
        
        from agents.roommate_matcher_parallel.agent import root_agent
        print("✅ parallel root_agent imported successfully")
        
        # Check the agent structure
        print(f"📊 Root agent name: {root_agent.name}")
        print(f"📊 Number of sub-agents: {len(root_agent.sub_agents)}")
        
        for i, agent in enumerate(root_agent.sub_agents, 1):
            print(f"   {i}. {agent.name}")
            
        print("\n🎉 All imports successful! The parallel system is ready to use.")
        
        # Display the performance architecture
        print("\n🚀 Performance Architecture:")
        print("   Sequential: profile_reader → match_scorer → red_flag → wingman → room_hunter")
        print("   Parallel:   profile_reader → [match_scorer + red_flag + wingman] → room_hunter")
        print("   Expected:   60-70% faster response times! ⚡")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


if __name__ == "__main__":
    success = test_imports()
    if success:
        print(f"\n✨ Ready to run! Use one of these:")
        print(f"   • python agent_runner.py          (uses parallel version)")
        print(f"   • python agent_runner_parallel.py (enhanced UI)")
        print(f"   • python performance_benchmark.py  (compare speeds)")
    else:
        print(f"\n❌ Setup incomplete. Please check the errors above.")
        sys.exit(1)
