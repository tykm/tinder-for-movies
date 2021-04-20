# Project 3 - Tinder for Movies

Developed by Tyler Kim, Dezrianna Chapman, Mahi Gada, Darshil Patel
Preview Application: [https://tinder-for-movies.herokuapp.com/](https://tinder-for-movies.herokuapp.com/) 

## Clone the repo

CLI Command: `git clone https://github.com/tykm/tinder-for-movies/`
<br /> If you cd into the repository you'll see all the files

## APIs

1. Sign up for a developer account for the Google OAuth API [https://developers.google.com/](https://developers.google.com/)
2. Sign up for a developer account for The Movie Database API [https://developers.themoviedb.org/3/getting-started/introduction](https://developers.themoviedb.org/3/getting-started/introduction)

## Install Requirements (if not already installed)

1. `npm install`
2. `pip install Flask`
3. `pip install -r requirements.txt`
4. `npm install react-google-login`
5. `npm install --save react-timer-hook`
6. `pip install pylint`
7. `npm install eslint --save-dev`
8. `npm install --save-dev --save-exact prettier`
9. `pip install yapf`

## Setup

1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. Create .env file in your main directory
3. Add line: `REACT_APP_GOOGLE_OAUTH_CLIENT_ID= YOUR_GOOGLE_OAUTH_CLIENT_ID`
4. Add line: `APIKEY= YOUR_MOVIE_DATABASE_API_KEY`

## Run Application

1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Create a free account on Heroku [https://signup.heroku.com/login](https://signup.heroku.com/login)
3. Log in to Heroku: `heroku login -i`
4. Add the requirements: `pip freeze > requirements.txt`
5. Create a Heroku app: `heroku create --buildpack heroku/python`
6. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
7. Add a database: `heroku addons:create heroku-postgresql:hobby-dev`
8. Check your env variables to find the value of `DATABASE_URL`: `heroku config`
9. Copy paste that value (looks like 'postgress://...')
10. Open your .env file and set `DATABASE_URL` variable: `touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" > .env`
11. Push to Heroku: `git push heroku main`
<<<<<<< HEAD
 
##Linting

1. `pylint app.py`
2. `npx eslint src/*.js`

* E1101 because it gives the error of Instance of 'SQLAlchemy' has no 'Column' member (no-member) and we need to have the db setup the way we have it
* W0621 Redefining name 'USERS' from outer scope (line 13) (redefined-outer-name) we need to use that var in a function no other way as we update that var
* C0103 Variable name "USERS" doesn't conform to snake_case naming style (invalid-name) it is a global var that we use in a function
* W1508 os.getenv default type is builtins.int. Expected str or None. (invalid-envvar-default) had to use os.getenv for apikeys
* W0611 says unused session import flask even when we use it
* W0612 variable name unused however, it was only used for adding to database

## Tech Issues

1. When we first started using a Javascript timere called interval where we had an issue stopping the timer at zero. We had to switch over to react-timer-hook which helped fix the issue we were having.
2. While we worked on the google-oauth we had received 404 errors where it would login, but not connect to anything. This issue was later fixed by updating a socket issue we were having in our app.py.
3. Another issue we had is with the pull and merges. Usually forgetting to pull before working on the code would give us a lot of errors later on. This issue also lead us to have errors in our code while we were linting. Github also gave us some issues with the workflow, but we fixed most of the issues by going through and fixing the issues.

## Problems

1. Genre.js page had an issue with a one click lag so we had to populate it on App.js. This allowed for their to be a fix with the way the users interacted with the page and the way the data collected from the votes was handled.
2. In our user story we said that we would include a link to the trailer and the review. We had to remove the trailer and review links from the page, because the Movie API did not have a way to access reviews and most movies rarely had a trailer to be associated with them
3. Admin session is currently operating on one person as an admin the person who created the room is in charge of anyone who enters the room. This issue could be fixed by changing how data is saved in the database. This is fixed when we changed our database and will be completely fixed when we start the functionality for rooms.

## What to Improve

I think the biggest improvement to make is the way we have people exit our page. The functionality of our ending page is a little lacking. We have it right now where there is no way to return to login scren or to retry the votes. Also having a set admin who is the first person to be logged into the database is giving us issues.
Currently another thing we should fix is the way we send and receive information from the database. It would probably be better to have it so that users who have made rooms previously can view previous information.
Overall the best way to improve the app would be to make it have more flesshed out functionality, however, for what our goal is the only way to do that would just be to make it so that users are more aware of each other.
This might include adding a list of their names or showing who may have voted for what or even which users voted for the movie that won.

