import React, { useState, useRef, useEffect } from "react";
import { socket } from "./App.js";
import Everyone from "./Everyone.js";


export function Rooms({ currUser, email }) {
    const roomName = useRef(null);
    const [entered, setEntered] = useState(false);
    const [room, setRoom] = useState("");

    function createRoom (rName) {
        console.log(rName);
        if (rName !== ""){
            socket.emit('onCreateRoom', {rName, currUser});
        }
    }
    function joinRoom(rName){
        console.log(rName);
        if (rName !== ""){
            socket.emit('onJoinRoom', {rName, currUser});
        }
    }
    
    useEffect(() => {
    socket.on("couldNotCreate", (data) => {
    if (data.room) {  
        console.log(data);
        setEntered(true);
        setRoom(data.room);
    }
    else{
        alert(data);
    }
    });
  }, []);

    return(
        <div>
    
            {entered ? <Everyone currUser={currUser} email={email} room={room} />
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
