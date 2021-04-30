import React, { useState, useEffect } from "react";
import { socket, App, genreList } from "./App.js";
import { Genres } from "./Genres.js";
//THERE ARE 4 WARNINGS FOR WINNER.JS, IDK WHAT HAPPENS IF YOU DELETE THEM
export function Winner({genreList, admin, currUser, room}) {
    const [leaves,setLeave] = useState(false);
    const [reges, setRegen] = useState(false);
    const [info,setInfo] = useState([]);
    const [decline, isDecline] = useState(0);
    let movieL, userL, voteL, pic, desc;
    useEffect(()=>{
        socket.on('movieWinner',(data)=>{
            setInfo(data);
            console.log(data);
        });
        socket.on('onDecline',(data)=>{
            isDecline(data + 1);
            console.log(isDecline);
        })
    },[]);
    //[name, number of like, rating, picture, dezcription]
  // will need props to get information from the other component
    // let changes while const will not be reassigned
    if(decline === 0){
        movieL = info[0];
        userL = info[1];
        voteL = info[2];
        pic =  info[3];
        desc = info[4]
    }
    else if(decline === 1){
        movieL = info[5];
        userL = info[6];
        voteL = info[7];
        pic =  info[8];
        desc = info[9]
    }
    else if(decline === 2){
        movieL = info[10];
        userL = info[11];
        voteL = info[12];
        pic =  info[13];
        desc = info[14]
    }
    let pos = 0; //The position of the movie with the highest rating; will be needed for the next sprint
    // { props.array } for the arrays and a useEffect to receive API information from the back-end
    // probably need to resize the image and create a stylesheet
 function leave(){
     setLeave(true)
 }
 function regen(){
     setRegen(true)
 }
 console.log(currUser, "this is the currUser")
 console.log(admin, "this is the admin")
 const page=(
        <div>
        <center>
            <h2>Winning Movie: {movieL}</h2>
            <img src={pic} alt="Movie Poster" />
            <p> 
                User likes: {userL}<br/>
                User rating: {voteL}<br/>
                Movie Description: <br/>
                {desc} <br/>
            </p>
             <input type='button' value="Return to Login" onClick={leave}/>
             <input type='button' value="Return to Genres Page" onClick={()=>{regen(); socket.emit('restartGame',room);}}/>
            {currUser === admin && decline < 2 ? 
                <input type='button' value="Decline" onClick={() => {isDecline(prev=>prev+1); 
                    console.log(decline, "Decline was Clicked");
                    socket.emit('onDecline', {decline, room})
                }}
                /> 
            : 
                null
            }
        </center>
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
                <Genres genreList={genreList} admin={admin} currUser={currUser}/>
            </div>
            );
    }
    
}
export default Winner;

