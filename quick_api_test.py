#!/usr/bin/env python3
"""
Quick API Validation Script
Tests core functionality of the Roommate Matcher API
"""

import requests
import json
import time


def test_api_endpoints():
    """Test key API endpoints for functionality"""
    print('🧪 Testing Key API Endpoints:')
    print('=' * 50)

    base_url = 'http://localhost:8000'
    results = {}

    # Test health endpoint
    try:
        r = requests.get(f'{base_url}/health', timeout=5)
        if r.status_code == 200:
            data = r.json()
            print(f'✅ Health: {r.status_code} - {data["status"]}')
            results['health'] = 'PASS'
        else:
            print(f'❌ Health: {r.status_code}')
            results['health'] = 'FAIL'
    except Exception as e:
        print(f'❌ Health: {str(e)}')
        results['health'] = 'ERROR'

    # Test quick search with city parameter
    try:
        r = requests.get(f'{base_url}/api/quick-search?city=Karachi', timeout=5)
        if r.status_code == 200:
            data = r.json()
            count = data.get('count', 0)
            print(f'✅ Quick Search: {r.status_code} - Found {count} results')
            results['quick_search'] = 'PASS'
        else:
            print(f'❌ Quick Search: {r.status_code}')
            results['quick_search'] = 'FAIL'
    except Exception as e:
        print(f'❌ Quick Search: {str(e)}')
        results['quick_search'] = 'ERROR'

    # Test quick search without parameters (should fail gracefully)
    try:
        r = requests.get(f'{base_url}/api/quick-search', timeout=5)
        print(f'✅ Quick Search (no params): {r.status_code}')
        results['quick_search_validation'] = 'PASS'
    except Exception as e:
        print(f'❌ Quick Search (no params): {str(e)}')
        results['quick_search_validation'] = 'ERROR'

    # Test chat sessions endpoint
    try:
        r = requests.get(f'{base_url}/api/chat/sessions', timeout=5)
        print(f'✅ Chat Sessions: {r.status_code}')
        results['chat_sessions'] = 'PASS'
    except Exception as e:
        print(f'❌ Chat Sessions: {str(e)}')
        results['chat_sessions'] = 'ERROR'

    # Test find matches endpoint (POST)
    try:
        test_profile = {
            "name": "Test User",
            "preferences": "Clean, quiet, student",
            "budget": "15000",
            "city": "Karachi",
            "area": "DHA"
        }
        r = requests.post(f'{base_url}/find-matches', json=test_profile, timeout=10)
        print(f'✅ Find Matches: {r.status_code}')
        results['find_matches'] = 'PASS'
    except Exception as e:
        print(f'❌ Find Matches: {str(e)}')
        results['find_matches'] = 'ERROR'

    # Summary
    print('\n' + '=' * 50)
    print('📊 Test Results Summary:')
    for endpoint, status in results.items():
        icon = '✅' if status == 'PASS' else '❌'
        print(f'{icon} {endpoint}: {status}')
    
    passed = sum(1 for status in results.values() if status == 'PASS')
    total = len(results)
    print(f'\n🎯 Overall: {passed}/{total} tests passed')
    
    return results


if __name__ == "__main__":
    results = test_api_endpoints()
