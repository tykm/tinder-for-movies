import React, { useState, inputRef, useRef } from "react";
import { socket } from "./App.js";
import Everyone from "./Everyone.js";


export function Rooms({ genreList, admin, currUser }) {
    const roomName = useRef(null);
    const [entered, setEntered] = useState(false);
    
    function createRoom (rName) {
        console.log(rName);
        if (rName !== ""){
            setEntered(true);
            socket.emit('onCreateRoom', {rName, currUser});
        }
    }
    function joinRoom(rName){
        console.log(rName);
        if (rName !== ""){
            setEntered(true);
            socket.emit('onJoinRoom', {rName, currUser});
        }
    }
    return(
        <div>
            {entered ? <Everyone genreList={genreList} admin={admin} currUser={currUser} /> 
            : 
            <div> 
                <input ref={roomName} type="text"/>
                <button onClick={() => { createRoom(roomName.current.value);}}> Create Room </button>
                <button onClick={() => { joinRoom(roomName.current.value);}}> Join Room </button>
            </div>
            }
        </div>
    );
}
export default Rooms;