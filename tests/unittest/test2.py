'''Unit testing login'''
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import on_send_movies_test

USERS_INPUT = 'users'
EXPECTED_OUTPUT = "expected"


class UpdateUserTestCase(unittest.TestCase):
    '''UpdateUserTestCase: Class'''
    def setUp(self):
        self.success_test_params = [{
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['Godzilla VS. Kong']
            }
        }, {
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong', 'Tom & Jerry']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['Godzilla VS. Kong', 'Tom & Jerry']
            }
        }]
        self.failure_test_params = [{
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['']
            }
        }, {
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong', 'Tom & Jerry']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['', '']
            }
        }]

        self.success_test_params2 = [{
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['movies']
            }
        }, {
            USERS_INPUT: {
                'movies' : ['Godzilla VS. Kong', 'Tom & Jerry']
            },
            EXPECTED_OUTPUT: {
                'movies' : ['movies', 'movies']
            }
        }]

    def test_add_user(self):
        '''Testing genre send success'''
        for test in self.success_test_params:
            actual_result = on_send_movies_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)

    def test_add_user_fail(self):
        '''Testing genre send fail'''
        for test in self.failure_test_params:
            actual_result = on_send_movies_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertNotEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)

    def test_add_user_specs(self):
        '''Testing genre send fail'''
        for test in self.success_test_params2:
            actual_result = on_send_movies_test(test[USERS_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertNotEqual(actual_result, expected_result)
        print(actual_result)
        print(expected_result)



if __name__ == '__main__':
    unittest.main()
