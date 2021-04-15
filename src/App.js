import logo from './logo.svg';
import './App.css';
import { Genres } from './Genres.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import GoogleLogin from 'react-google-login';

const socket = io(); // Connects to socket connection
const arr = ['','']
function App() {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element
  const [success, setSucc] = useState(false);
  const [info, setInfo] = useState(arr);
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  // Upon user login print out user's name and email

   useEffect(()=>{
        socket.on('email',(data)=>{
            console.log(data)
            setInfo(data);
        });
    },[]);
  
  function onLoginButton(response) {
    try{
      console.log(response.profileObj.name)
      console.log(response.profileObj.email);
      let infoNE = [response.profileObj.name, response.profileObj.email]
      socket.emit('email', infoNE)
      setSucc(true)
    }
    catch(err){
      window.alert('Login Failed. Please Try Again')
    }
  }
if (success === true){
  return(
    <div>
      <Genres />
    </div>
    );
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
      <div>
        <button type="button" onClick={() => setLog(!isLogged)}>Login</button>
        {isLogged ? (<Genres />):null}
      </div>
    </div>
  );
}
export default App;