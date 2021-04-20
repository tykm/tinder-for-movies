import './App.css';
import { Genres } from './Genres.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GoogleLogin from 'react-google-login';
export const socket = io(); // Connects to socket connection

const arr = ['',''];
function App() {
  const [users, setUsers] = useState([]); // State variable, list of messages
  const [success, setSucc] = useState(false);
  const [info, setInfo] = useState(arr);
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  const [currUser, setCurrUser]=useState('');
  const [genreList, setGenreList] = useState(['', '', '', '', '', '', '', '', '', '']); 
  //const [timesUp, setTimesUp] = useState(false);
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
    socket.on('genres',(data)=>{
        setGenreList(data);
        console.log(genreList);
    });
    },[]);

  function onLoginButton(response) {
    try{
      console.log(response.profileObj.name);
      console.log(response.profileObj.email);
      console.log(info);
      let infoNE = [response.profileObj.name, response.profileObj.email];
      setCurrUser(infoNE[1]);
      socket.emit('email', infoNE);
      setSucc(true);
    }
    catch(err){
      window.alert('Login Failed. Please Try Again');
    }
  }
if (success === true){
  if(users[0] === currUser && !isLogged){
    return(
      <div>
      {!isLogged ? 
        <button onClick= {()=>{genrePage()}}>Everyone's In</button> 
        : null
      }
    </div>)}
    else if (users[0] !== currUser && !isLogged){
      return (<div>Waiting for Admin to start voting</div>);
    }
}

function genrePage(){
  socket.emit('everyonesIn', true);
  socket.emit('genres');
  console.log(isLogged);
}

  return (
    <div>
    {isLogged ? <div>
                    <Genres genreList = {genreList}/>
                </div>: 
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        buttonText="Login"
        onSuccess={onLoginButton}
        onFailure={onLoginButton}
        cookiePolicy={'single_host_origin'}
      />
    }
    </div>
  );
}
export default App;