import os
import requests
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

genres = []

# genreVotes = {'28' : ['Action', 0], '12' : ['Adventure', 0], '16' :
#['Animation', 0], '32' : ['Comedy', 0],
#'80' : ['Crime', 0], '18' : ['Drama', 0], '27' : ['Horror', 0], '9648' : ['Mystery', 0],
#'10749' : ['Romance', 0], '878' : ['Science Fiction', 0]}
#workflowcheck
genreVotes = {}
users = []

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
    return send_from_directory('./build', filename)

def getGenres():
    load_dotenv(find_dotenv())
    GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + os.getenv('APIKEY') + '&language=en-US'
    genresResponse = requests.get(GENRES_URL)
    genresResponse = genresResponse.json()
    for i in range(10):
        genres.append(genresResponse['genres'][i]['name'])
        genreVotes[genresResponse['genres'][i]['name']] = [0]
        genreVotes[genresResponse['genres'][i]['name']].append(genresResponse['genres'][i]['id'])

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    print('User connected!')
    getGenres()

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
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
    print("Email: " + user_info[1])
    print("Name: " + user_info[0])
    
        # Check if user not already in DB then add user to DB
    users = get_users()
    if email not in users:
        add_user(user_info[1], user_info[0])
    
    print(User.query.all())
    DB.session.commit()
    users.append(user_info[1])
    SOCKETIO.emit('onLogin', users, broadcast=True)

SOCKETIO.on('everyonesIn')
def startVote(data):
    SOCKETIO.emit('everyonesIn', genres, broadcast=True, include_self=False)

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
    
