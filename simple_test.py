#!/usr/bin/env python3
"""Simple test of parallel roommate matching performance"""

import asyncio
import time
from google.genai.types import Content, Part
from agents.roommate_matcher_parallel.agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService


async def test_parallel_performance():
    print("🚀 Testing parallel roommate matching performance...")
    
    # Setup
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name='test_app',
        user_id='test_user',
        session_id='test_session'
    )
    runner = Runner(agent=root_agent, app_name='test_app', session_service=session_service)
    
    # Test query
    query = "I need a quiet medical student roommate in G-13 Islamabad"
    print(f"📝 Query: {query}")
    
    # Time the execution
    start_time = time.time()
    
    message = Content(parts=[Part.text(query)])
    response = await runner.run('test_user', 'test_session', message)
    
    end_time = time.time()
    processing_time = end_time - start_time
    
    # Results
    print(f"⚡ Completed in {processing_time:.2f} seconds!")
    
    if response and hasattr(response, 'text'):
        response_length = len(response.text)
        print(f"📊 Response: {response_length} characters")
        
        # Show a preview of the response
        preview = response.text[:200].replace('\n', ' ')
        print(f"👀 Preview: {preview}...")
        
        # Performance assessment
        if processing_time < 8:
            print("🎉 Excellent performance! Parallel processing working well.")
        elif processing_time < 12:
            print("✅ Good performance improvement over sequential.")
        else:
            print("⚠️ Performance could be better - check parallel agent setup.")
    else:
        print("❌ No response received")


if __name__ == "__main__":
    asyncio.run(test_parallel_performance())
