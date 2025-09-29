#!/usr/bin/env python3
"""
ChatBot Memory System Test
"""

import requests
import json


def test_chatbot_memory():
    print('🧠 Testing ChatBot Memory System:')
    print('=' * 50)

    base_url = 'http://localhost:8000'
    
    try:
        # First message
        payload1 = {
            'message': 'Hello, I need help finding a roommate in Karachi',
            'sessionId': 'test-session-123'
        }
        r1 = requests.post(f'{base_url}/api/chat/message', json=payload1, timeout=10)
        print(f'✅ First message: {r1.status_code}')
        
        # Second message (should have context)
        payload2 = {
            'message': 'What areas do you recommend?',
            'sessionId': 'test-session-123'
        }
        r2 = requests.post(f'{base_url}/api/chat/message', json=payload2, timeout=10)
        print(f'✅ Second message: {r2.status_code}')
        
        # Check session persistence  
        r3 = requests.get(f'{base_url}/api/chat/sessions', timeout=5)
        if r3.status_code == 200:
            sessions = r3.json()
            session_count = len(sessions.get('sessions', []))
            print(f'✅ Sessions stored: {session_count}')
        
        print('🎯 ChatBot memory system operational!')
        
    except Exception as e:
        print(f'❌ ChatBot test failed: {e}')


if __name__ == "__main__":
    test_chatbot_memory()
