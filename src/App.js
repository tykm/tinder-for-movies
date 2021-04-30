import "./App.css";
import { Rooms } from "./Rooms.js";
import { useState } from "react";
import io from "socket.io-client";
import GoogleLogin from "react-google-login";
export const socket = io(); // Connects to socket connection

export function App() {
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  const [currUser, setCurrUser] = useState("");
  const [email, setEmail] = useState("")

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
    <div>
     <p>
      Hello
      </p>
      {isLogged ? (
        <div>
          <Rooms currUser={currUser} email={email}/>
        </div>
      ) : (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={onLoginButton}
          onFailure={onLoginButton}
          cookiePolicy={"single_host_origin"}
        />
      )}

    </div>
  );
}
export default App;