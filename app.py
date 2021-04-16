import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Horror', 'Mystery', 'Romance', 'Science Fiction']

genreVotes = {'28' : ['Action', 0], '12' : ['Adventure', 0], '16' : ['Animation', 0], '32' : ['Comedy', 0], 
              '80' : ['Crime', 0], '18' : ['Drama', 0], '27' : ['Horror', 0], '9648' : ['Mystery', 0],
              '10749' : ['Romance', 0], '878' : ['Science Fiction', 0]}
              
users = []

APP = Flask(__name__, static_folder='./build/static')
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

DB = SQLAlchemy(APP)
class Player(DB.Model):
    """ Player class is an object that represents a player in the DB """
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

SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@SOCKETIO.on('email')
def on_email(user_info):
    print("Received user info!")
    print("Email: " + user_info[1])
    print("Name: " + user_info[0])
    users.append(user_info[1])
    SOCKETIO.emit('onLogin', users, broadcast=True)
    
    
@SOCKETIO.on('everyonesIn')
def startVote(data):
    SOCKETIO.emit('everyonesIn', data, broadcast=True)

@SOCKETIO.on('onSubmit')
def on_Submit(votes):
    counter = 0
    for keys in genreVotes:
        counter = counter + 1
        if votes[counter] == 1:
            genreVotes[keys] = genreVotes[keys][1] + votes[counter]
    SOCKETIO.emit('onAdminSubmit', genreVotes, broadcast=True)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )