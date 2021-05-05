# Project 3 - Tinder for Movies

Developed by Tyler Kim, Dezrianna Chapman, Mahi Gada, Darshil Patel
Preview Application: [https://tinder-for-movies4.herokuapp.com/](https://tinder-for-movies4.herokuapp.com/)

After the login create a room and make sure to have other users join that room. Make sure to vote for the Genre and Movie. Click the submit button at the end of the page for each. View the results where the admin can restart the game or decline. When a user is done they are able to logout and return to the login page.

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

##Linting

1. `pylint app.py`
2. `npx eslint src/*.js`

- E1101 because it gives the error of Instance of 'SQLAlchemy' has no 'Column' member (no-member) and we need to have the db setup the way we have it.
- W0621 Redefining name 'USERS' from outer scope (line 13) (redefined-outer-name) we need to use that var in a function no other way as we update that var
- C0103 Variable name "USERS" doesn't conform to snake_case naming style (invalid-name) it is a global var that we use in a function
- W1508 os.getenv default type is builtins.int. Expected str or None. (invalid-envvar-default) had to use os.getenv for apikeys
- W0611 says unused session import flask even when we use it
- W0612 variable name unused however, it was only used for adding to database

## Tech Issues

1. Some issue we had were duplicate words appearing on the page. This was a rendering issue that was solved after deleting a few lines of code and rearranging where the title would show up.
2. Another issue we had was getting our restart to work. When the game would restart it would only be for the admin and there were a couple of other issues where it wouldn't work with other users.
3. We had a lot of issues connecting our google-oauth to the Heroku. For some reason the transfer between our Cloud9 and github to Heroku was making it so that users could no longer login. We were able to fix it after trying many different methods to do with the API key setup.
## Problems

1. Before we presented we found an issue where the restart button failed to restart the Genres component. We were able to quickly fix this so that when clicked a new round of voting could begin.
2. Some of our buttons early on worked in resetting the game, but not is resetting the list for the movies. Where able to fix this later on using by having the data be resent when the button was clicked so that the old data would clear.
3. We had an issue with users who entered the room showing up multiple times. We were able to fix this by changing the way data was inserted into the database so that no duplicates would occur.

## What to Improve

I think that for the most part our app runs well and we implemented most of the things we wanted.
Maybe if there was more time we would format it different or stylize it more. 
We would also probably include a way to view previous movie choices or a way to see what a person has voted for.
Our group could have also added more features and expanded our database, but for what we have this is a great start to an app that could be marketable.
We should also add a function where if everyone has submitted it will move on to the next page instead of wait the full time even if everyone has already voted.
This includes displaying the number of people who have/haven't voted.