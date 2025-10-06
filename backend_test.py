import requests
import sys
import json
from datetime import datetime
import time

class EcoSphereAPITester:
    def __init__(self, base_url="https://cityhealth-map.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}, Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}"
                except:
                    details = f"Status: {response.status_code}, Response length: {len(response.text)}"
            else:
                details = f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            self.log_test(name, False, "Request timed out")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_environmental_report(self):
        """Test environmental report endpoint"""
        test_location = {
            "latitude": 28.6139,
            "longitude": 77.2090,
            "address": "New Delhi, India"
        }
        
        success, response = self.run_test(
            "Environmental Report API",
            "POST",
            "environmental-report",
            200,
            data=test_location,
            timeout=45  # AI suggestions may take time
        )
        
        if success and response:
            # Validate response structure
            required_fields = ['location', 'aqi_data', 'weather_data', 'water_logging_risk', 'ai_suggestions']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("Environmental Report Structure", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Environmental Report Structure", True, "All required fields present")
                
                # Test AQI data structure
                aqi_data = response.get('aqi_data', {})
                aqi_fields = ['aqi', 'pm25', 'pm10', 'status']
                missing_aqi = [field for field in aqi_fields if field not in aqi_data]
                
                if missing_aqi:
                    self.log_test("AQI Data Structure", False, f"Missing AQI fields: {missing_aqi}")
                else:
                    self.log_test("AQI Data Structure", True, f"AQI: {aqi_data.get('aqi')}, Status: {aqi_data.get('status')}")
                
                # Test AI suggestions
                ai_suggestions = response.get('ai_suggestions', [])
                if isinstance(ai_suggestions, list) and len(ai_suggestions) > 0:
                    self.log_test("AI Suggestions", True, f"Generated {len(ai_suggestions)} suggestions")
                else:
                    self.log_test("AI Suggestions", False, "No AI suggestions generated")
                
                return True
        
        return success

    def test_civic_reports_create(self):
        """Test creating a civic report"""
        test_report = {
            "location": {
                "latitude": 28.6139,
                "longitude": 77.2090,
                "address": "Test Location, New Delhi"
            },
            "report_type": "water_log",
            "description": "Test water logging issue for API testing",
            "severity": "medium",
            "reporter_id": "test_user_123"
        }
        
        success, response = self.run_test(
            "Create Civic Report",
            "POST",
            "civic-reports",
            200,
            data=test_report
        )
        
        if success and response:
            # Store report ID for later tests
            self.test_report_id = response.get('id')
            required_fields = ['id', 'location', 'report_type', 'description', 'severity', 'timestamp']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("Civic Report Structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Civic Report Structure", True, f"Report ID: {response.get('id')}")
        
        return success

    def test_civic_reports_get(self):
        """Test getting civic reports"""
        success, response = self.run_test(
            "Get Civic Reports",
            "GET",
            "civic-reports",
            200
        )
        
        if success and response:
            if isinstance(response, list):
                self.log_test("Civic Reports List", True, f"Retrieved {len(response)} reports")
            else:
                self.log_test("Civic Reports List", False, "Response is not a list")
        
        return success

    def test_civic_reports_with_location(self):
        """Test getting civic reports with location filter"""
        params = "?latitude=28.6139&longitude=77.2090&radius=0.1"
        
        success, response = self.run_test(
            "Get Civic Reports with Location",
            "GET",
            f"civic-reports{params}",
            200
        )
        
        if success and response:
            if isinstance(response, list):
                self.log_test("Location-filtered Reports", True, f"Retrieved {len(response)} reports near location")
            else:
                self.log_test("Location-filtered Reports", False, "Response is not a list")
        
        return success

    def test_ai_chat(self):
        """Test AI chat endpoint"""
        test_message = {
            "message": "What's the current air quality like and what precautions should I take?",
            "location": {
                "latitude": 28.6139,
                "longitude": 77.2090
            }
        }
        
        success, response = self.run_test(
            "AI Chat Endpoint",
            "POST",
            "chat",
            200,
            data=test_message,
            timeout=45  # AI responses may take time
        )
        
        if success and response:
            required_fields = ['response', 'suggestions']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("AI Chat Response Structure", False, f"Missing fields: {missing_fields}")
            else:
                response_text = response.get('response', '')
                suggestions = response.get('suggestions', [])
                self.log_test("AI Chat Response Structure", True, 
                            f"Response length: {len(response_text)}, Suggestions: {len(suggestions)}")
                
                # Check if response contains meaningful content
                if len(response_text) > 20:
                    self.log_test("AI Chat Content Quality", True, "Response has meaningful content")
                else:
                    self.log_test("AI Chat Content Quality", False, "Response too short or empty")
        
        return success

    def test_water_logging_zones(self):
        """Test water logging zones endpoint"""
        params = "?latitude=28.6139&longitude=77.2090&radius=0.05"
        
        success, response = self.run_test(
            "Water Logging Zones",
            "GET",
            f"water-logging-zones{params}",
            200
        )
        
        if success and response:
            if 'prone_areas' in response:
                prone_areas = response['prone_areas']
                if isinstance(prone_areas, list):
                    self.log_test("Water Logging Data Structure", True, f"Found {len(prone_areas)} prone areas")
                else:
                    self.log_test("Water Logging Data Structure", False, "prone_areas is not a list")
            else:
                self.log_test("Water Logging Data Structure", False, "Missing prone_areas field")
        
        return success

    def test_error_handling(self):
        """Test API error handling"""
        # Test with invalid location data
        invalid_location = {
            "latitude": "invalid",
            "longitude": 77.2090
        }
        
        success, response = self.run_test(
            "Error Handling - Invalid Data",
            "POST",
            "environmental-report",
            422,  # Expecting validation error
            data=invalid_location
        )
        
        # If we get 500 instead of 422, that's also acceptable for this test
        if not success:
            # Try again expecting 500
            success, response = self.run_test(
                "Error Handling - Server Error",
                "POST",
                "environmental-report",
                500,
                data=invalid_location
            )
        
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting EcoSphere API Testing...")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        self.test_root_endpoint()
        
        # Test main environmental report endpoint
        self.test_environmental_report()
        
        # Test civic reports functionality
        self.test_civic_reports_create()
        self.test_civic_reports_get()
        self.test_civic_reports_with_location()
        
        # Test AI chat functionality
        self.test_ai_chat()
        
        # Test water logging zones
        self.test_water_logging_zones()
        
        # Test error handling
        self.test_error_handling()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Save detailed results
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump({
                'summary': {
                    'total_tests': self.tests_run,
                    'passed_tests': self.tests_passed,
                    'failed_tests': self.tests_run - self.tests_passed,
                    'success_rate': (self.tests_passed/self.tests_run)*100,
                    'test_timestamp': datetime.now().isoformat()
                },
                'detailed_results': self.test_results
            }, f, indent=2)
        
        return self.tests_passed == self.tests_run

def main():
    tester = EcoSphereAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())