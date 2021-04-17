'''Main Function creates and initializes all the necessary vars'''
import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
 
genreVotes = {'28' : ['Action', 0], '12' : ['Adventure', 0], '16' : ['Animation', 0], '32' : ['Comedy', 0], 
              '80' : ['Crime', 0], '18' : ['Drama', 0], '27' : ['Horror', 0], '9648' : ['Mystery', 0],
              '10749' : ['Romance', 0], '878' : ['Science Fiction', 0]}

users = {}

APP = Flask(__name__, static_folder='./build/static')
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

DB = SQLAlchemy(APP)
class User(DB.Model):
    """ User class is an object that represents a user in the DB """
    email = DB.Column(DB.String(60), primary_key=True)
    name = DB.Column(DB.String(50), primary_key=False)

    def __init__(self, email, name):
        self.email = email
        self.name = name

    def __repr__(self):
        return self.email + ": " + self.name

    def print_player(self):
        """ Prints user data """
        print(self.email)
        print(self.name)


DB.create_all()
DB.session.commit()
 
SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''Index File'''
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''when connecting to client'''
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''when diconnecting from client'''
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
 
@SOCKETIO.on('on_login')
def on_login(): # data is whatever arg you pass in your emit call on client
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('on_login',  genreVotes, broadcast=True, include_self=False)


def add_user(email, name):
    """ Helper function to add player """
    new_user = User(email, name)
    DB.session.add(new_user)
    DB.session.commit()
    print("New user added to DB")


def find_emails(all_users):
    """ Helper function to filter for emails """
    emails = []    
    for user in all_users:
        emails.append(user.email)
    return emails


def get_users():
    """ Helper function to find current user emails """
    all_users = User.query.all()
    emails = find_emails(all_users)
    return emails


@SOCKETIO.on('email')
def on_email(user_info):
    """ Add user to db upon successful google oauth """
    # Parse sent data
    email = user_info[1]
    name = user_info[0]
    
    # Debug print statement
    print("Received user info!")
    print("Email: " + email)
    print("Name: " + name)
    
    # Check if user not already in DB then add user to DB
    users = get_users()
    if email not in users:
        add_user(user_info[1], user_info[0])
    
    print(User.query.all())
    DB.session.commit()
    

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
     SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
 
    )
 
