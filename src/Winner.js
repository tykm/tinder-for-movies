import React, { useState, useEffect } from 'react';
import { socket } from './App.js';
export function Winner() {
    useEffect(()=>{
        socket.on('movieWinner',(data)=>{
            console.log(data)
        });
    },[]);
  // will need props to get information from the other component
    // let changes while const will not be reassigned
    const movieL = ["The array of movies received to Rec.js"]
    const voteL = ["However the votes for each movie will be sent"]
    let pos = 0 //The position of the movie with the highest rating; will be needed for the next sprint
    // { props.array } for the arrays and a useEffect to receive API information from the back-end
    // probably need to resize the image and create a stylesheet
    return (
        <div>
            <p> Movie name here... {movieL[pos]}</p>
            <img src="www.defareallink.com" alt="Movie Poster" />
            <p> 
                User rating: {voteL[pos]}<br/>
                Movie Description <br/>
                <a href="www.defareallink.com"> Movie review </a> <br/>
                <a href="www.defareallink.com"> Movie trailer </a>
            </p>
        </div>
    );
    
}