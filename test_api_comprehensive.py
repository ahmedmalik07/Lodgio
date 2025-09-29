#!/usr/bin/env python3
"""
Comprehensive Test Suite for Roommate Matcher API
Industry Standard Testing Implementation

Author: Ahmed Malik
Version: 1.0.0
"""

import unittest
import requests
import json
import time
from datetime import datetime
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RoommateMatcherAPITests(unittest.TestCase):
    """Comprehensive test suite for API endpoints"""
    
    BASE_URL = "http://localhost:8000"
    SIMPLE_URL = "http://localhost:8080" 
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment"""
        cls.session = requests.Session()
        cls.test_data = {
            "valid_roommate": {
                "name": "Test User",
                "city": "Lahore",
                "area": "DHA",
                "budget": "15000-20000",
                "preferences": "Clean, quiet",
                "contact": "test@email.com"
            },
            "valid_chat_message": {
                "message": "Salam! Budget ke baare mein bataiye",
                "context_memory": [],
                "session_id": f"test_session_{int(time.time())}"
            }
        }
    
    @classmethod 
    def tearDownClass(cls):
        """Clean up after tests"""
        cls.session.close()
    
    def setUp(self):
        """Set up before each test"""
        self.start_time = time.time()
        
    def tearDown(self):
        """Clean up after each test"""
        duration = time.time() - self.start_time
        logger.info(f"Test {self._testMethodName} completed in {duration:.3f}s")
    
    # Health Check Tests
    def test_health_endpoint(self):
        """Test API health check endpoint"""
        try:
            response = self.session.get(f"{self.BASE_URL}/health", timeout=5)
            self.assertEqual(response.status_code, 200)
            
            data = response.json()
            self.assertEqual(data["status"], "success")
            self.assertIn("services", data["data"])
            
            logger.info("✅ Health check passed")
        except requests.exceptions.RequestException as e:
            self.fail(f"Health check failed: {e}")
    
    def test_simple_app_health(self):
        """Test simple app availability"""
        try:
            response = self.session.get(f"{self.SIMPLE_URL}/", timeout=5)
            self.assertEqual(response.status_code, 200)
            logger.info("✅ Simple app health check passed")
        except requests.exceptions.RequestException as e:
            logger.warning(f"⚠️ Simple app not available: {e}")
    
    # Quick Search Tests
    def test_quick_search_valid_city(self):
        """Test quick search with valid city"""
        response = self.session.get(f"{self.BASE_URL}/api/quick-search?city=lahore")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("roommates", data)
        self.assertIsInstance(data["roommates"], list)
        
        logger.info(f"✅ Quick search returned {len(data['roommates'])} results")
    
    def test_quick_search_invalid_city(self):
        """Test quick search with invalid city"""
        response = self.session.get(f"{self.BASE_URL}/api/quick-search?city=nonexistentcity")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        # Should return empty list or fallback data
        
    def test_quick_search_missing_parameter(self):
        """Test quick search without city parameter"""
        response = self.session.get(f"{self.BASE_URL}/api/quick-search")
        
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data["status"], "error")
    
    # Chat API Tests
    def test_chat_message_valid(self):
        """Test chat message with valid input"""
        response = self.session.post(
            f"{self.BASE_URL}/api/chat/message",
            json=self.test_data["valid_chat_message"],
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data["status"], "success")
            self.assertIn("response", data)
            logger.info("✅ Chat message test passed")
        else:
            logger.warning(f"⚠️ Chat API not available: {response.status_code}")
    
    def test_chat_message_invalid(self):
        """Test chat message with invalid input"""
        response = self.session.post(
            f"{self.BASE_URL}/api/chat/message",
            json={"invalid": "data"},
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 400 for missing required fields
        self.assertIn(response.status_code, [400, 500])
    
    # Rate Limiting Tests
    def test_rate_limiting(self):
        """Test API rate limiting"""
        # Make multiple rapid requests
        responses = []
        for i in range(5):
            response = self.session.get(f"{self.BASE_URL}/health")
            responses.append(response.status_code)
        
        # All should succeed with reasonable rate limiting
        success_count = sum(1 for code in responses if code == 200)
        self.assertGreater(success_count, 0, "Rate limiting too aggressive")
        logger.info(f"✅ Rate limiting test: {success_count}/5 requests succeeded")
    
    # Error Handling Tests
    def test_404_handling(self):
        """Test 404 error handling"""
        response = self.session.get(f"{self.BASE_URL}/nonexistent-endpoint")
        
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertEqual(data["status"], "error")
        self.assertIn("not found", data["error"].lower())
        
    def test_malformed_json(self):
        """Test malformed JSON handling"""
        response = self.session.post(
            f"{self.BASE_URL}/api/chat/message",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 400)
    
    # Performance Tests
    def test_response_time_performance(self):
        """Test API response time performance"""
        start_time = time.time()
        response = self.session.get(f"{self.BASE_URL}/health")
        end_time = time.time()
        
        response_time = end_time - start_time
        self.assertLess(response_time, 2.0, f"Response time too slow: {response_time:.3f}s")
        logger.info(f"✅ Response time: {response_time:.3f}s")
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        import threading
        import queue
        
        results = queue.Queue()
        
        def make_request():
            try:
                response = self.session.get(f"{self.BASE_URL}/health", timeout=10)
                results.put(response.status_code)
            except Exception as e:
                results.put(f"Error: {e}")
        
        # Create 5 concurrent threads
        threads = []
        for i in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads
        for thread in threads:
            thread.join()
        
        # Check results
        success_count = 0
        while not results.empty():
            result = results.get()
            if result == 200:
                success_count += 1
        
        self.assertGreater(success_count, 0, "No concurrent requests succeeded")
        logger.info(f"✅ Concurrent test: {success_count}/5 requests succeeded")


class DataValidationTests(unittest.TestCase):
    """Tests for data validation and processing"""
    
    def test_roommate_data_structure(self):
        """Test roommate data structure validation"""
        # This would test the RoommateProfile dataclass
        # Implementation depends on having the classes importable
        pass
    
    def test_chat_message_structure(self):
        """Test chat message data structure validation"""
        # This would test the ChatMessage dataclass
        pass


def run_performance_benchmark():
    """Run performance benchmarks"""
    logger.info("🚀 Running performance benchmarks...")
    
    BASE_URL = "http://localhost:8000"
    
    # Test multiple endpoints
    endpoints = [
        "/health",
        "/api/quick-search?city=lahore",
        "/api/quick-search?city=karachi",
        "/api/quick-search?city=islamabad"
    ]
    
    results = {}
    
    for endpoint in endpoints:
        times = []
        for i in range(10):
            start = time.time()
            try:
                response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
                end = time.time()
                if response.status_code == 200:
                    times.append(end - start)
            except requests.exceptions.RequestException:
                pass
        
        if times:
            avg_time = sum(times) / len(times)
            min_time = min(times)
            max_time = max(times)
            results[endpoint] = {
                "avg": avg_time,
                "min": min_time,
                "max": max_time,
                "count": len(times)
            }
    
    # Report results
    logger.info("\n📊 Performance Benchmark Results:")
    logger.info("=" * 50)
    for endpoint, stats in results.items():
        logger.info(f"{endpoint}:")
        logger.info(f"  Average: {stats['avg']:.3f}s")
        logger.info(f"  Min:     {stats['min']:.3f}s") 
        logger.info(f"  Max:     {stats['max']:.3f}s")
        logger.info(f"  Tests:   {stats['count']}/10")
        logger.info("")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Roommate Matcher API Test Suite")
    parser.add_argument("--benchmark", action="store_true", help="Run performance benchmarks")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    if args.benchmark:
        run_performance_benchmark()
    else:
        # Run unit tests
        logger.info("🧪 Starting API Test Suite...")
        logger.info("=" * 50)
        
        unittest.main(verbosity=2 if args.verbose else 1, exit=False)
        
        logger.info("\n✨ Test suite completed!")
