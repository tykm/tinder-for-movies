import React, { useState, useRef, useEffect } from "react";
import { socket } from "./App.js";
import Everyone from "./Everyone.js";


export function Rooms({ currUser, email }) {
    const roomName = useRef(null);
    const [entered, setEntered] = useState(false);
    const [room, setRoom] = useState("");
    const [inRoom, setInRoom] = useState(true);
    const [joinRoomExists, setJoinRoomExists] = useState(true);

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
    
    useEffect(() => {
    socket.on("onCreateRoom", (inRoom) => {
      console.log(inRoom[1]);
      setInRoom(inRoom[1]);
    });
    socket.on("onJoinRoom", (inRoom) => {
      console.log(inRoom[1]);
      setJoinRoomExists(inRoom[1]);
    });
  }, []);

    return(
        <div>
            {entered && inRoom && joinRoomExists ? <Everyone currUser={currUser} email={email} room={room} />
            :
            <div>
                <input ref={roomName} type="text"/>
                <button onClick={() => { createRoom(roomName.current.value);}}> Create Room </button>
                <button onClick={() => { joinRoom(roomName.current.value);}}> Join Room </button>
            </div>
            }
            {!joinRoomExists ? <div>The room you are trying to join does not exist please create room or join another room!</div> : null}
            {!inRoom ? <div>The room you are trying to create already exists please join the room or create a different room!</div> : null}
        </div>
    );
}
export default Rooms;
