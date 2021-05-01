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
  const [about, setAbout]=useState(false);

  function onLoginButton(response) {
    try {
      console.log(response.profileObj.name);
      console.log(response.profileObj.email);

      let infoNE = [response.profileObj.name, response.profileObj.email];
      setCurrUser(infoNE[0]);
      setEmail(infoNE[1])
      socket.emit("email", infoNE);
      setLog(true);
    } catch (err) {
      window.alert("Login Failed. Please Try Again");
    }
  }
  return (
    <div><center><h1>Tinder for Movies</h1></center>
      {isLogged ? (
        <div>
          <Rooms currUser={currUser} email={email}/>
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
        <br/><br/>
        <button className = "aboutButton" onClick={() => {
                setAbout(!about);
              }}>About</button>
        {about ? (<div><h2>Functionality</h2><h2>Why it Matters</h2><h2> Developed By</h2>
        <p>Tyler Kim<br/>Darshil Patel<br/>Mahi Gada<br/>Dezrianna Chapman</p></div>) : null}
         </center>
      )}
    </div>
  );
}
export default App;