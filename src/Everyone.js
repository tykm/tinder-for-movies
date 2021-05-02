import React, { useState, useEffect } from "react";
import { socket } from "./App.js";
import Genres from "./Genres.js";
import "./App.css";
function Everyone({ currUser, email, room }){
    const [name, setName] = useState([]); // State variable, list of messages
    const [everyonesin, setEveryonesIn] = useState(false);
    const [genreList, setGenreList] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    function genrePage() {
        socket.emit("everyonesIn", {true: true, room});
        socket.emit("genres", room);
    }

    useEffect(() => {
        socket.on("everyonesIn", (data) => {
            console.log(data);
            setEveryonesIn(data)
        });
        socket.on("genres", (data) => {
            setGenreList(data);
            console.log(genreList);
        });
        socket.on('onRoom', (data)=>{
            setName(data)
            console.log(data)
        })
    }, [])

    if (name[0] === currUser) {
        return (
            <div>
                {everyonesin ?
                    <Genres genreList={genreList} admin={name[0]} currUser={currUser} room={room} />
                     :
                    <div>
                        <center><h2>Users Logged In:</h2>
                        {name.map((n) => ( <div className="name">{n}</div>))}
                        <br /> <button className="everyoneButton" onClick={genrePage}> Everyone's In </button></center>
                    </div>
                    
                }
            </div>
        )
    } else {
        return (
            <div>
             <div><center><h1>Tinder for Movies</h1></center></div>
            {everyonesin ?
                <Genres genreList={genreList} admin={name[0]} currUser={currUser} room={room} />
                :
                <div>
                <center><h2>Users Logged In:</h2>
                    {name.map((n) => (<div className="name">{n}</div>))}
                    <br/><div className="name"><b>Waiting for Admin to Begin voting</b></div></center>
                </div> 
            }
            </div>
        );
    }
}

export default Everyone;