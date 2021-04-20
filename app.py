'''Main Function creates and initializes all the necessary vars'''
import os
import requests
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv


GENREVOTES = {}
USERS = []
MOVIESVOTES = {}
APP = Flask(__name__, static_folder='./build/static')
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

# Point SQLAlchemy to heroku DB
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
# Bypass warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
    '''on_connect'''
    get_genres()
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
    '''on login'''
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('on_login', GENREVOTES, broadcast=True, include_self=False)


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
    USERS = get_users()
    if email not in USERS:
        add_user(user_info[1], user_info[0])
    print(User.query.all())
    DB.session.commit()
    USERS.append(user_info[1])
    SOCKETIO.emit('onLogin', USERS, broadcast=True)


@SOCKETIO.on('everyonesIn')
def start_vote(data):
    '''emit for everyone's in button'''
    SOCKETIO.emit('everyonesIn', data, broadcast=True)

@SOCKETIO.on('genres')
def send_genres():
    '''send list of genres'''
    genres = []
    for keys in GENREVOTES:
        genres.append(keys)
    print(genres)
    SOCKETIO.emit('genres', genres, broadcast=True)

@SOCKETIO.on('onSubmit')
def on_submit(votes):
    '''when votes for genres are submitted'''
    counter = 0
    for keys in GENREVOTES:
        if votes[counter] == '1' and votes[counter] is not None:
            GENREVOTES[keys][0] = GENREVOTES[keys][0] + 1
        counter = counter + 1
    print(GENREVOTES)
    SOCKETIO.emit('onAdminSubmit', GENREVOTES, broadcast=True)


def get_genres():
    '''get list of genres from api'''
    load_dotenv(find_dotenv())
    genres_url = 'https://api.themoviedb.org/3/genre/movie/list?api_key='
    genres_url = genres_url + os.getenv('APIKEY') + '&language=en-US'
    genres_response = requests.get(genres_url)
    genres_response = genres_response.json()
    for i in range(10):
        GENREVOTES[genres_response['genres'][i]['name']] = [0]
        GENREVOTES[genres_response['genres'][i]['name']].append(genres_response['genres'][i]['id'])

def winning_genre(GENREVOTES):
    '''get winner genre'''
    minimum = 0
    winner = ''
    for keys in GENREVOTES:
        if GENREVOTES[keys][0] > minimum:
            minimum = GENREVOTES[keys][0]
            winner = GENREVOTES[keys][1]
    return winner

@SOCKETIO.on('moviesList')
def on_send_movies():
    '''send list of movies'''
    movies = get_movies()
    print(movies)
    SOCKETIO.emit('moviesList', movies, broadcast=True)

@SOCKETIO.on('onSubmitMovies')
def on_submit_movie_votes(votes):
    '''calculate movie votes'''
    counter = 0
    print(votes, 'IM HEREEEEEEE')
    for keys in MOVIESVOTES:
        if votes[counter] == '1' and votes[counter] is not None:
            MOVIESVOTES[keys][0] = MOVIESVOTES[keys][0] + 1
            print(MOVIESVOTES[keys])
            print(MOVIESVOTES[keys][0])
        counter = counter + 1
    print(MOVIESVOTES)
    winner = []
    winner.append(movie_winner())
    winner.append(MOVIESVOTES[winner[0]][0])
    winner.append(MOVIESVOTES[winner[0]][1])
    winner.append(MOVIESVOTES[winner[0]][2])
    winner.append(MOVIESVOTES[winner[0]][3])
    print(winner)
    SOCKETIO.emit('movieWinner', winner, broadcast=True)

def movie_winner():
    '''get movie winner'''
    minimum = 0
    winner = ''
    for keys in MOVIESVOTES:
        if MOVIESVOTES[keys][0] > minimum:
            minimum = MOVIESVOTES[keys][0]
            winner = keys
    return winner

def get_movies():
    '''get list of movies from api'''
    load_dotenv(find_dotenv())
    winner = winning_genre(GENREVOTES)
    movies_url = 'https://api.themoviedb.org/3/discover/movie?api_key='
    movies_url = movies_url + os.getenv('APIKEY')
    movies_url = movies_url + '&language=en-US&sort_by=popularity.desc&include_adult=false'
    movies_url = movies_url + '&include_video=false&page=1&with_genres=' + str(winner)
    movie_response = requests.get(movies_url)
    movie_response = movie_response.json()
    movies = []
    MOVIESVOTES.clear()
    for i in range(10):
        movies.append(movie_response['results'][i]['original_title'])
        MOVIESVOTES[movie_response['results'][i]['original_title']] = []
        MOVIESVOTES[movie_response['results'][i]['original_title']].append(0)
        MOVIESVOTES[movie_response['results'][i]['original_title']].append(
            movie_response['results'][i]['vote_average'])
        MOVIESVOTES[movie_response['results'][i]['original_title']].append(
            'https://image.tmdb.org/t/p/w500/' + movie_response['results'][i]['poster_path'])
        MOVIESVOTES[movie_response['results'][i]['original_title']].append(
            movie_response['results'][i]['overview'])
    return movies

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
