import "./App.css";
import { Rooms } from "./Rooms.js";
import { useState } from "react";
import io from "socket.io-client";
import GoogleLogin from "react-google-login";
export const socket = io(); // Connects to socket connection

export function App() {
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  const [currUser, setCurrUser] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState(false);

  function onLoginButton(response) {
    try {
      console.log(response.profileObj.name);
      console.log(response.profileObj.email);

      let infoNE = [response.profileObj.name, response.profileObj.email];
      setCurrUser(infoNE[0]);
      setEmail(infoNE[1]);
      socket.emit("email", infoNE);
      setLog(true);
    } catch (err) {
      window.alert("Login Failed. Please Try Again");
    }
  }

  return (
    <div>
      <center>
        <h1>Tinder for Movies</h1>
      </center>
      {isLogged ? (
        <div>
          <Rooms currUser={currUser} email={email} setLog={setLog} />
        </div>
      ) : (
        <center>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
            buttonText="Login"
            onSuccess={onLoginButton}
            onFailure={onLoginButton}
            cookiePolicy={"single_host_origin"}
          />
          <br />
          <br />
          <button
            className="aboutButton"
            onClick={() => {
              setAbout(!about);
            }}
          >
            About
          </button>
          {about ? (
            <div>
              <h2>Functionality</h2>
              <div className="aboutFormat">
                <p>
                  Our app is designed to allow a group of users to make movie
                  selections based on the number of likes a movie has gotten.
                  This is done by allowing our users to come togther and choose
                  which movies they like or dislike. Users start off by logging
                  in and creating or joining a voting room. First, we allow our
                  users to decide on a genre, then they can choose which movies
                  they like within that genre. At the end of the voting the
                  movie with the most user votes get displayed for everyone to
                  see. From there they can decide to login into a different room
                  or restart the voting in the same room. If the admin, who is
                  the creator of the room, decides that they don't like the
                  movie choice they can decline the movie selection up to three
                  times. After that they can decide to start over on the login
                  or genre voting page.
                </p>
              </div>

              <h2>Why it Matters</h2>
              <div className="aboutFormat">
                <p>
                  The reason our app is being made is to give people an
                  oppurtunity to find new content. During the last year people
                  have been really isolated and left with few options on ways to
                  entertain themselves. Even with access to the internet doing
                  the same things everyday can be boring and it can be hard to
                  find new ways to entertain yourself. Our app allows for people
                  to find new movies to enjoy themselves when they no longer
                  know what to watch. The user is also able to have their
                  friends help them make a choice which allows them to have some
                  form of interaction with each other. With everything that is
                  happening we thought it would be best to make something that
                  could be entertaining, socially safe, and allow for people to
                  interact with each other.
                </p>
              </div>
              <h2> Developed By</h2>
              <p>
                Tyler Kim
                <br />
                Darshil Patel
                <br />
                Mahi Gada
                <br />
                Dezrianna Chapman
              </p>
            </div>
          ) : null}
        </center>
      )}
    </div>
  );
}
export default App;
