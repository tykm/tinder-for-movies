import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
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
  /*return(
    <div>
      <Genres />
    </div>
    );
    */
    console.log(success)
}
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    
  }, []);
  
  
  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        buttonText="Login"
        onSuccess={onLoginButton}
        onFailure={onLoginButton}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}

export default App;