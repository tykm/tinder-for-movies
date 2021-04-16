import logo from './logo.svg';
import './App.css';
import { Genres } from './Genres.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import GoogleLogin from 'react-google-login';
const socket = io(); // Connects to socket connection

const arr = ['','']
function App() {
  const [users, setUsers] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element
  const [success, setSucc] = useState(false);
  const [info, setInfo] = useState(arr);
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  const [currUser, setCurrUser]=useState('');
  
  useEffect(()=>{
    socket.on('email',(data)=>{
      console.log(data);
      setInfo(data);
    });
    socket.on('onLogin',(data)=>{
      console.log("INLOGIN");
      console.log(data);
      setUsers(data);
    });
    socket.on('everyonesIn',(data)=>{
      console.log(data);
      setLog(data);
    });
    },[]);

  function onLoginButton(response) {
    try{
      console.log(response.profileObj.name)
      console.log(response.profileObj.email);
      let infoNE = [response.profileObj.name, response.profileObj.email]
      setCurrUser(infoNE[1]);
      socket.emit('email', infoNE)
      setSucc(true)
    }
    catch(err){
      window.alert('Login Failed. Please Try Again')
    }
  }
if (success === true){
  console.log(currUser);
  if(users[0] == currUser){
    return(<button onClick={genrePage}>Everyone's In</button>);}
    return (<div>Waiting for Admin to start voting</div>);}

function genrePage(){
  socket.emit('everyonesIn', true);
  console.log(isLogged);
  if(isLogged){
    return  (<div><Genres /> </div>);
  }
}

  return (
    <div>
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        buttonText="Login"
        onSuccess={onLoginButton}
        onFailure={onLoginButton}
        cookiePolicy={'single_host_origin'}
      />
      </div>
    </div>
  );
}
export default App;