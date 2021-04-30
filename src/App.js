import "./App.css";
import { Genres } from "./Genres.js";
import { Rooms } from "./Rooms.js";
import Everyone from "./Everyone.js";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import GoogleLogin from "react-google-login";
export const socket = io(); // Connects to socket connection

const arr = ["", ""];
export function App() {
  const [users, setUsers] = useState([]); // State variable, list of messages
  const [names, setNames] = useState([]);
  const [success, setSucc] = useState(false);
  const [info, setInfo] = useState(arr);
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  const [currUser, setCurrUser] = useState("");
  const [admin, setAdmin] = useState("")
  const [genreList, setGenreList] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  //const [timesUp, setTimesUp] = useState(false);
  useEffect(() => {
    socket.on("email", (data) => {
      console.log(data);
      setInfo(data);
    });
    socket.on("onLogin", (data) => {
      console.log("INLOGIN");
      console.log(data);
      setAdmin(data[0]);
      setUsers(data[0]);
      setNames(data[1]);
    });
    socket.on("everyonesIn", (data) => {
      console.log(data);
      setLog(data);
    });
    socket.on("genres", (data) => {
      setGenreList(data);
      console.log(genreList);
    });
  }, []);

  function onLoginButton(response) {
    try {
      console.log(response.profileObj.name);
      console.log(response.profileObj.email);
      console.log(info);
      let infoNE = [response.profileObj.name, response.profileObj.email];
      setCurrUser(infoNE[1]);
      socket.emit("email", infoNE);
      setSucc(true);
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
          <Everyone genreList={genreList} admin={admin} currUser={currUser} success={success} users={users} isLogged={isLogged} names={names}/>
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
