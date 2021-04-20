'''Unit testing login'''
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import send_genres_test

USERS_INPUT = 'users'
EXPECTED_OUTPUT = "expected"


class UpdateUserTestCase(unittest.TestCase):
    '''UpdateUserTestCase: Class'''
    def setUp(self):
        self.success_test_params = [{
            USERS_INPUT: {
                'Action': "hello"
            },
            EXPECTED_OUTPUT: {
                'results' : ['Action']
            }
        }, {
            USERS_INPUT: {
                'Action': "hello",
                'Adventure' : 'hi'
            },
            EXPECTED_OUTPUT: {
                'results' : ['Action', 'Adventure']
            }
        }]
        self.failure_test_params = [{
            USERS_INPUT: {
                'Action': "hello"
            },
            EXPECTED_OUTPUT: {
                'results' : ['hello']
            }
        }, {
            USERS_INPUT: {
                'Action': "hello",
                'Adventure' : 'hi'
            },
            EXPECTED_OUTPUT: {
                'results' : ['hello', 'hi']
            }
        }]

        self.success_test_params2 = [{
            USERS_INPUT: {
                'Action': "hello",
                'Adventure' : 'hi'
            },
            EXPECTED_OUTPUT: {
                'results' : ['Action', 'hello', 'Adventure', 'hi']
            }
        }, {
            USERS_INPUT: {
                'Action': "hello",
                'Adventure' : 'hi',
                'Comedy' : 'funny'
            },
            EXPECTED_OUTPUT: {
                'results' : ['Action', 'hello', 'Adventure', 'hi', 'Comedy', 'funny']
            }
        }]

    def test_add_user(self):
        '''Testing genre send success'''
        for test in self.success_test_params:
            actual_result = send_genres_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)

    def test_add_user_fail(self):
        '''Testing genre send fail'''
        for test in self.failure_test_params:
            actual_result = send_genres_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertNotEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)

    def test_add_user_specs(self):
        '''Testing genre send fail'''
        for test in self.success_test_params2:
            actual_result = send_genres_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertNotEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)



if __name__ == '__main__':
    unittest.main()
