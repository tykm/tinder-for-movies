import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath("../../"))
from app import User, add_user

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"
INITIAL_USER = User("abc@gmail.com", "abc")

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: ["abc@gmail.com", "abc"],
                KEY_EXPECTED: INITIAL_USER
            }
        ]
        
        self.failure_test_params = [
            {
                # Reversed params order
                KEY_INPUT: ["abc@gmail.com", "abc"],
                KEY_EXPECTED: User("abc", "abc@gmail.com")
            },
            {
                # Two email fields
                KEY_INPUT: ["abc@gmail.com", "abc@gmail.com"],
                KEY_EXPECTED: INITIAL_USER
            }
        ]
        
        self.initial_db_mock = []
    
    
    def mocked_db_session_add(self, user):
        self.initial_db_mock.append(user)


    def mocked_db_session_commit(self):
        pass
    
    
    def test_success(self):
        for test in self.success_test_params:
            with patch("app.DB.session.add", self.mocked_db_session_add):
                with patch("app.DB.session.commit", self.mocked_db_session_commit):
                    actual_result = add_user(test[KEY_INPUT][0], test[KEY_INPUT][1])
                    expected_result = test[KEY_EXPECTED]
                    
                    self.assertEqual(len(actual_result.email), len(expected_result.email))
                    self.assertEqual(actual_result.email, expected_result.email)
                    self.assertEqual(len(actual_result.name), len(expected_result.name))
                    self.assertEqual(actual_result.name, expected_result.name)


if __name__ == "__main__":
    unittest.main()