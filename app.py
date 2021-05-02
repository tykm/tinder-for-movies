'''Main Function creates and initializes all the necessary vars'''
import os
from collections import Counter
import requests
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

GENREVOTES = {}
USERS = []
MOVIESVOTES = {}
ROOMS = {}
#{room1 : {listOfUsers : [], GenreVotes : {}, MovieVotes:{}}
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

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''Index File'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''on_connect'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''when diconnecting from client'''
    print('User disconnected!')


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided


@SOCKETIO.on('on_login')
def on_login():  # data is whatever arg you pass in your emit call on client
    '''on login'''
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('on_login', GENREVOTES, broadcast=True, include_self=False)

@SOCKETIO.on('onCreateRoom')
def create_room(data):
    inRoom = False
    if data["rName"] not in ROOMS:
        ROOMS[data["rName"]] = {'activeUsers' : [], 'genreVotes' : {}, 'movieVotes' : {}}
        ROOMS[data["rName"]]['activeUsers'].append(data["currUser"])
        join_room(data["rName"])
        get_genres(data["rName"])
        print(ROOMS[data["rName"]]['genreVotes'])
        inRoom = True
        #SOCKETIO.emit('inRoom', False, broadcast=False, include_self=True)
    SOCKETIO.emit('onRoom', [ROOMS[data["rName"]]['activeUsers'], inRoom], broadcast=False, room=data['rName'])

@SOCKETIO.on('onJoinRoom')
def joining_room(data):
    inRoom = False
    if data["rName"] in ROOMS:
        ROOMS[data["rName"]]['activeUsers'].append(data["currUser"])
        join_room(data["rName"])
        #.emit('roomNotExists', False, broadcast=False, include_self=True)
        inRoom = True

    SOCKETIO.emit('onRoom', [ROOMS[data["rName"]]['activeUsers'], inRoom], broadcast=False, room=data['rName'])

def add_user(email, name):
    """ Helper function to add player """
    new_user = User(email, name)
    DB.session.add(new_user)
    DB.session.commit()
    print("New user added to DB")
    return new_user


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


def get_names():
    '''getting names of the users'''
    names = []
    for user in User.query.all():
        names.append(user.name)
    return names

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
    names = get_names()
    if email not in USERS:
        add_user(user_info[1], user_info[0])
    print(User.query.all())
    DB.session.commit()
    USERS.append(user_info[1])
    data = [USERS, names]
    SOCKETIO.emit('onLogin', data, broadcast=True)


@SOCKETIO.on('everyonesIn')
def start_vote(data):
    '''emit for everyone's in button'''
    SOCKETIO.emit('everyonesIn', data['true'], broadcast=True, room=data['room'])

@SOCKETIO.on('restartGame')
def reset_genre_votes(data):
    '''resetting the genrevotes dictionary for future use'''
    for keys in ROOMS[data]['genreVotes']:
        ROOMS[data]['genreVotes'][keys][0] = 0

@SOCKETIO.on('genres')
def send_genres(data):
    '''send list of genres'''
    genres = []
    for keys in ROOMS[data]['genreVotes']:
        genres.append(keys)
    #print(genres)
    SOCKETIO.emit('genres', genres, broadcast=True, room=data)

def send_genres_test(genrevotes):
    '''send list of genres'''
    genres = []
    genrev = {'results' : []}
    for keys in genrevotes:
        genres.append(keys)
    genrev['results'] = genres
    return genrev


@SOCKETIO.on('onSubmit')
def on_submit(data):
    '''when votes for genres are submitted'''
    counter = 0
    votes = data["genres"]
    for keys in ROOMS[data["room"]]['genreVotes']:
        if votes[counter] == '1' and votes[counter] is not None:
            ROOMS[data["room"]]['genreVotes'][keys][0] = ROOMS[data["room"]]['genreVotes'][keys][0] + 1
        counter = counter + 1
    #print(ROOMS[data["room"]]['genreVotes'])
    print(data["room"], 'line199')
    print(winning_genre(ROOMS[data["room"]]['genreVotes']), 'The winning genres line 200')
    SOCKETIO.emit('onAdminSubmit', ROOMS[data["room"]]['genreVotes'], broadcast=True, room=data["room"])


def get_genres(room):
    '''get list of genres from api'''
    load_dotenv(find_dotenv())
    genres_url = 'https://api.themoviedb.org/3/genre/movie/list?api_key='
    genres_url = genres_url + os.getenv('APIKEY') + '&language=en-US'
    genres_response = requests.get(genres_url)
    genres_response = genres_response.json()
    for i in range(10):
        ROOMS[room]['genreVotes'][genres_response['genres'][i]['name']] = [0]
        ROOMS[room]['genreVotes'][genres_response['genres'][i]['name']].append(
            genres_response['genres'][i]['id'])


def winning_genre(genreVotes):
    '''get winner genre'''
    minimum = 0
    winner = ''
    for keys in genreVotes:
        if genreVotes[keys][0] > minimum:
            minimum = genreVotes[keys][0]
            winner = genreVotes[keys][1]
    return winner


@SOCKETIO.on('moviesList')
def on_send_movies(data):
    '''send list of movies'''
    print(data, ROOMS[data]['genreVotes'], 'line 230')
    movies = get_movies(data)
    #print(movies)
    SOCKETIO.emit('moviesList', movies, broadcast=True, room=data)

def on_send_movies_test(mlist):
    '''send list of movies'''
    movies = mlist
    return movies


@SOCKETIO.on('onSubmitMovies')
def on_submit_movie_votes(data):
    '''calculate movie votes'''
    counter = 0
    votes=data["movies"]
    for keys in ROOMS[data['room']]['movieVotes']:
        if votes[counter] == '1' and votes[counter] is not None:
            ROOMS[data['room']]['movieVotes'][keys][0] = ROOMS[data['room']]['movieVotes'][keys][0] + 1
            #print(ROOMS[data['room']]['movieVotes'][keys])
            #print(ROOMS[data['room']]['movieVotes'][keys][0])
        counter = counter + 1
    winner = []
    tempList = movie_winner(data["room"])
    #print(tempList, 'This is the winner')
    #print(ROOMS[data['room']]['movieVotes'], 'Dict for movievotes')
    for i in range(3):
        winner.append(tempList[i])
        winner.append(ROOMS[data['room']]['movieVotes'][str(tempList[i])][0])
        winner.append(ROOMS[data['room']]['movieVotes'][str(tempList[i])][1])
        winner.append(ROOMS[data['room']]['movieVotes'][str(tempList[i])][2])
        winner.append(ROOMS[data['room']]['movieVotes'][str(tempList[i])][3])
    #print(winner, 'This is printing the winner')
    SOCKETIO.emit('movieWinner', winner, broadcast=True, room=data["room"])


def movie_winner(data):
    '''get movie winner'''
    minimum = 0
    winner = []
    tempDict = {}
    for keys in ROOMS[data]["movieVotes"]:
        tempDict[keys] = ROOMS[data]["movieVotes"][keys][0]
    #     if MOVIESVOTES[keys][0] > minimum:
    #         minimum = MOVIESVOTES[keys][0]
    #         winner = keys
    #print(tempDict, "Use this for decline")
    k = Counter(tempDict)
    topThree = k.most_common(3)
    for keys in topThree:
        #print(keys[0])
        winner.append(str(keys[0]))
    #print(winner, "Top Three movies")
    return winner


def get_movies(data):
    '''get list of movies from api'''
    load_dotenv(find_dotenv())
    print(ROOMS[data]['genreVotes'])
    winner = winning_genre(ROOMS[data]['genreVotes'])
    print('winner when getting movies', winner)
    movies_url = 'https://api.themoviedb.org/3/discover/movie?api_key='
    movies_url = movies_url + os.getenv('APIKEY')
    movies_url = movies_url + '&language=en-US&sort_by=popularity.desc&include_adult=false'
    movies_url = movies_url + '&include_video=false&page=1&with_genres=' + str(
        winner)
    movie_response = requests.get(movies_url)
    movie_response = movie_response.json()
    movies = []
    ROOMS[data]["movieVotes"].clear()
    for i in range(10):
        movies.append(movie_response['results'][i]['original_title'])
        ROOMS[data]["movieVotes"][movie_response['results'][i]['original_title']] = []
        ROOMS[data]["movieVotes"][movie_response['results'][i]['original_title']].append(0)
        ROOMS[data]["movieVotes"][movie_response['results'][i]['original_title']].append(
            movie_response['results'][i]['vote_average'])
        if movie_response['results'][i]['poster_path'] is not None:
            ROOMS[data]["movieVotes"][movie_response['results'][i]['original_title']].append(
                'https://image.tmdb.org/t/p/w500/' +
                movie_response['results'][i]['poster_path'])
        ROOMS[data]["movieVotes"][movie_response['results'][i]['original_title']].append(
            movie_response['results'][i]['overview'])
        #MOVIESVOTES holds {"Title" : [userVotes, rating, posterpath, description]}
        #for all movies in genre
        #movies holds the  titles of the movies in a list
    return movies


@SOCKETIO.on('onDecline')
def on_decline(data):
    '''Decline Button Emit'''
    print(data["decline"])
    SOCKETIO.emit('onDecline', data["decline"], broadcast=True, room=data["room"])

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
