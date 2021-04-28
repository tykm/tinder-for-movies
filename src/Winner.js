import React, { useState, useEffect } from "react";
import { socket, App, genreList } from "./App.js";
import { Genres } from "./Genres.js";

export function Winner({genreList}) {
    const [leaves,setLeave] = useState(false);
    const [reges, setRegen] = useState(false);
    const [info,setInfo] = useState([]);
    useEffect(()=>{
        socket.on('movieWinner',(data)=>{
            setInfo(data);
        });
    },[]);
    //[name, number of like, rating, picture, dezcription]
  // will need props to get information from the other component
    // let changes while const will not be reassigned
    const movieL = info[0];
    const voteL = info[2];
    const pic =  info[3];
    let pos = 0; //The position of the movie with the highest rating; will be needed for the next sprint
    // { props.array } for the arrays and a useEffect to receive API information from the back-end
    // probably need to resize the image and create a stylesheet
 function leave(){
     setLeave(true)
 }
 function regen(){
     setRegen(true)
 }
 const page=(
        <div>
            <p> Movie name here... {movieL}</p>
            <img src={pic} alt="Movie Poster" />
            <p> 
                User likes: {info[1]}<br/>
                User rating: {voteL}<br/>
                Movie Description: <br/>
                {info[4]} <br/>
            </p>
             <input type='button' value="Return to Login" onClick={leave}/>
             <input type='button' value="Return to Genres Page" onClick={regen}/>
        </div>
    )
    if(leaves === false && reges === false){
        return page;
    }
    else if (leaves === true){
        return(
            <div>
                <App />
            </div>
            );
    }
    else if (reges === true){
        return(
            <div>
                <Genres genreList={genreList}/>
            </div>
            );
    }
    
}
export default Winner;

