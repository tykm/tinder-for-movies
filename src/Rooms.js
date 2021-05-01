import React, { useState, useRef } from "react";
import { socket } from "./App.js";
import Everyone from "./Everyone.js";
import "./App.css";

export function Rooms({ currUser, email }) {
    const roomName = useRef(null);
    const [entered, setEntered] = useState(false);
    const [room, setRoom] = useState("");

    function createRoom (rName) {
        console.log(rName);
        if (rName !== ""){
            setEntered(true);
            setRoom(rName)
            socket.emit('onCreateRoom', {rName, currUser});
        }
    }
    function joinRoom(rName){
        console.log(rName);
        if (rName !== ""){
            setEntered(true);
            setRoom(rName)
            socket.emit('onJoinRoom', {rName, currUser});
        }
    }

    return(
        <div>
            {entered ? <Everyone currUser={currUser} email={email} room={room} />
            :
            <div>
                <center>
                 <input className = "room" ref={roomName} type="text"/>
                <br />
                <br />
                <button className = "aboutButton" onClick={() => { createRoom(roomName.current.value);}}> Create Room </button>
                <br />
                <br />
                <button className = "aboutButton" onClick={() => { joinRoom(roomName.current.value);}}> Join Room </button>
                </center>
            </div>
            }
        </div>
    );
}
export default Rooms;
