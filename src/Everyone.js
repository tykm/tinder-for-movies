import React, { useState, useEffect } from "react";
import { socket } from "./App.js";
import Genres from "./Genres.js";

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
                        {name.map((n) => ( <div className="name">{n}</div>))}
                        <button onClick={genrePage}> Everyone's In </button>
                    </div>
                    
                }
            </div>
        )
    } else {
        return (
            <div>
            {everyonesin ?
                <Genres genreList={genreList} admin={name[0]} currUser={currUser} room={room} />
                :
                <div>
                    {name.map((n) => (<div className="name">{n}</div>))}
                    <div>Waiting for Admin to start voting</div>
                </div> 
                
            }
            </div>
        );
    }
}

export default Everyone;