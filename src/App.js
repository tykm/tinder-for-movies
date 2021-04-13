import logo from './logo.svg';
import './App.css';
import { Genres } from './Genres.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [isLogged, setLog] = useState(false); // useState to check if user is logged in
  return (
    <div>
      <button type="button" onClick={() => setLog(!isLogged)}>Login</button>
      {isLogged ? (<Genres />):null}
    </div>
  );
}
export default App;