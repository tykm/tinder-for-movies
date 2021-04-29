import "./App.css";
import { Genres } from "./Genres.js";
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
  const [about, setAbout]=useState(false)
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
  if (success === true) {
    if (users[0] === currUser && !isLogged) {
      return (
        <div>
          {!isLogged ? (
            <div>
              {names.map((name) => (
              <div className="name">{name}</div>
              ))}
            
            <button
              onClick={() => {
                genrePage();
              }}
            >
              Everyone's In
            </button>
            </div>
          ) : null}
           
        </div>
      );
    } else if (users[0] !== currUser && !isLogged) {
      return (
        <div>
          {names.map((name) => (
            <div className="name">{name}</div>
          ))}
          <div>Waiting for Admin to start voting</div>
        </div>
        );
    }
  }

  function genrePage() {
    socket.emit("everyonesIn", true);
    socket.emit("genres");
    console.log(isLogged);
  }

  return (
    <div>
    <center>
    <h1>Tinder for Movies</h1></center>
      {isLogged ? (
        <div>
          <Genres genreList={genreList} admin={admin} currUser={currUser} />
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
