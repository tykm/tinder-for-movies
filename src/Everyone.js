import React, { useState } from "react";
import { socket } from "./App.js";
import { Genres } from "./Genres.js";

function Everyone({ genreList, admin, currUser}){
    
    if (success === true) {
    if (users[0] === currUser && !isLogged) {
      return (
        <div>
          {!isLogged ? (
            <div>
              {names.map((name) => (
              <div className="name">{name}</div>
              ))}
            
            <button
              onClick={() => {
                genrePage();
              }}
            >
              Everyone's In
            </button>
            </div>
          ) : null}
           
        </div>
      );
    } else if (users[0] !== currUser && !isLogged) {
      return (
        <div>
          {names.map((name) => (
            <div className="name">{name}</div>
          ))}
          <div>Waiting for Admin to start voting</div>
        </div>
        );
    }
  }
    
    function genrePage() {
    socket.emit("everyonesIn", true);
    socket.emit("genres");
    console.log(isLogged);
  }
    
return(
    <div>
        
    </div>
);
}

export default Everyone;