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
      console.log(response.profileObj.email)
      console.log(info)
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
  if(users[0] == currUser && !isLogged){
    return(
      <div>
      {isLogged ? <Genres /> : 
      <button onClick= {()=>{socket.emit('everyonesIn', true);}}>Everyone's In</button> 
      }
    </div>)}
    else if (users[0] != currUser && !isLogged){
      return (<div>Waiting for Admin to start voting</div>);
    }
    else if (isLogged){
      return(<div> <Genres /> </div>)
    }
  
}

function genrePage(){
  socket.emit('everyonesIn', true);
  console.log(isLogged);
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
    {isLogged ? <Genres /> : null}
    </div>
  );
}
export default App;