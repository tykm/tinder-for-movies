'''Main Function creates and initializes all the necessary vars'''
import os
import requests
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import json

genreVotes = {}
users = []
moviesVotes = {}
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
    getGenres()
 
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
    
    
@SOCKETIO.on('everyonesIn')
def startVote(data):
    SOCKETIO.emit('everyonesIn', data, broadcast=True)

@SOCKETIO.on('genres')
def sendGenres():
    genres = []
    for keys in genreVotes:
        genres.append(keys)
    print(genres)
    SOCKETIO.emit('genres', genres, broadcast=True)

@SOCKETIO.on('onSubmit')
def on_Submit(votes):
    counter = 0
    for keys in genreVotes:
        if votes[counter] == '1' and votes[counter] != None:
            genreVotes[keys][0] = genreVotes[keys][0] + 1
        counter = counter + 1
    print(genreVotes)
    SOCKETIO.emit('onAdminSubmit', genreVotes, broadcast=True)
    

def getGenres():
    load_dotenv(find_dotenv())
    GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + os.getenv('APIKEY') + '&language=en-US'
    genresResponse = requests.get(GENRES_URL)
    genresResponse = genresResponse.json()
    for i in range(10):
        genreVotes[genresResponse['genres'][i]['name']] = [0]
        genreVotes[genresResponse['genres'][i]['name']].append(genresResponse['genres'][i]['id'])
    
def winningGenre(genreVotes):
    minimum = 0
    winner = ''
    for keys in genreVotes:
        if genreVotes[keys][0] > minimum:
            minimum = genreVotes[keys][0]
            winner = genreVotes[keys][1]
    return winner

@SOCKETIO.on('moviesList')
def on_sendMovies():
    movies = getMovies()
    print(movies)
    SOCKETIO.emit('moviesList', movies, broadcast=True)

@SOCKETIO.on('onSubmitMovies')
def on_Submit_Movie_Votes(votes):
    counter = 0
    print (votes, 'IM HEREEEEEEE')
    for keys in moviesVotes:
        if votes[counter] == '1' and votes[counter] != None:
            moviesVotes[keys][0] = moviesVotes[keys][0] + 1
            print(moviesVotes[keys])
            print(moviesVotes[keys][0])
        counter = counter + 1
    print(moviesVotes)
    winner = []
    winner.append(movie_winner())
    winner.append(moviesVotes[winner[0]][0])
    winner.append(moviesVotes[winner[0]][1])
    winner.append(moviesVotes[winner[0]][2])
    winner.append(moviesVotes[winner[0]][3])
    print(winner)
    SOCKETIO.emit('movieWinner', winner, broadcast=True)
    
def movie_winner():
    minimum = 0
    winner = ''
    for keys in moviesVotes:
        if moviesVotes[keys][0] > minimum:
            minimum = moviesVotes[keys][0]
            winner = keys
    return winner

def getMovies():
    load_dotenv(find_dotenv())
    winner = winningGenre(genreVotes)
    MOVIES_URL = 'https://api.themoviedb.org/3/discover/movie?api_key=' + os.getenv('APIKEY') + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=' + str(winner)
    movieResponse = requests.get(MOVIES_URL)
    movieResponse = movieResponse.json()
    movies = []
    moviesVotes.clear()
    for i in range(10):
        print("\n\n\nDEBUGGING\n\n\n")
        print(movieResponse['results'][i])
        movies.append(movieResponse['results'][i]['original_title'])
        moviesVotes[movieResponse['results'][i]['original_title']] = []
        moviesVotes[movieResponse['results'][i]['original_title']].append(0)
        moviesVotes[movieResponse['results'][i]['original_title']].append(movieResponse['results'][i]['vote_average'])
        moviesVotes[movieResponse['results'][i]['original_title']].append('https://image.tmdb.org/t/p/w500/' + movieResponse['results'][i]['poster_path'])
        moviesVotes[movieResponse['results'][i]['original_title']].append(movieResponse['results'][i]['overview'])
        
    return movies
    
# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
 
