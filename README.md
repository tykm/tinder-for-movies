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
