import { ListItem } from './ListItem.js';
import React, { useState, useEffect } from 'react';
import { socket } from './App.js'
export function Genres({startTime}) {
    const [genres, setGenres] = useState(Array(10).fill(null)); // sets board to empty array
    const genreList = ['1', '2','3','4','5','6','7', '8','9', '10'];
    function Genres(index, isLike) {
        const newGenres = [...genres];
        if (newGenres[index] === null) {
            newGenres[index] = isLike ? '1' : '0';
            setGenres(newGenres);
            console.log(isLike);
            }
            console.log(newGenres);
    }
    if (startTime === 0){
        socket.emit('onAdminSubmit', genres);
        console.log('subbmitted votes on timer=0')
    }
    
    return (
    <div>
        <center>Vote on Genres</center>
        {genreList.map((g, index)=>(
        <div>
            <ul>Genre {g}</ul>
            <button onClick={() => {Genres(index, true)}}>Like</button>
            <button onClick={() => {Genres(index, false)}}>Dislike</button>
        </div>
        ))}
        <div>
            <button onClick={() => {socket.emit('onSubmit', genres);}}>Submit</button>
        </div>
    </div>
    );
}
