import { ListItem } from './ListItem.js';
import React, { useState, useEffect } from 'react';
import socket from './App.js'
export function Genres(props) {
    const [genres, setGenres] = useState(['', '', '', '', '', '', '', '', '', '']); // sets board to empty array
    const [isLike, setLike] = useState(false); // useState for if they liked 
    const [isDisLike, setDisLike] = useState(false); // useState for if they dislike
    const genreList = ['1', '2','3','4','5','6','7', '8','9', '10'];
    
    function Genres(index) {
        console.log("INGENRES");
        const newGenres = [...genres];
        console.log(newGenres);
        console.log(isLike);
        console.log(isDisLike)
        if (newGenres[index] === '') {
            console.log("INIF");
            console.log(isLike);
            console.log(isDisLike);
            newGenres[index] = isLike ? '1' : '0';
            
            setGenres(newGenres);
            if(isLike){
                setLike((prevLike) => !prevLike);
            }
            if(isDisLike){
                setDisLike((prevDisLike) => !prevDisLike);
            }
            console.log(isLike);
            console.log(isDisLike);
            }
            console.log(newGenres);
       // socket.emit('genres', {genre: newGenres, index}); 
    }
  
    return (
    <div>
    <button>Everyone's In</button>
    <center>Vote on Genres</center>
   {genreList.map((g, index)=>(
   <div>
   <ul>Genre {g}</ul>
   <button onClick={() => {setLike(!isLike); Genres({index})}}>Like</button>
   <button onClick={() => {setDisLike(!isDisLike); Genres({index})}}>Dislike</button>
    </div>))}
    </div>);
    }
