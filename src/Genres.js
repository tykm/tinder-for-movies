import { ListItem } from './ListItem.js';
import React, { useState, useEffect } from 'react';
import { socket } from './App.js';
import { Movies} from './Movies.js';
export function Genres({startTime , genreList}) {
    const [genres, setGenres] = useState(Array(10).fill(null)); // sets board to empty array
    const [isGenrePage, setGenrePage] = useState(false);
    function Genres(index, isLike) {
        const newGenres = [...genres];
        if (newGenres[index] === null) {
            newGenres[index] = isLike ? '1' : '0';
            setGenres(newGenres);
            console.log(isLike);
            }
            console.log(newGenres);
        
    }
    useEffect(()=>{
    socket.on('genres',(data)=>{
        if (startTime == 0){
            setGenrePage(true);
            socket.emit('onAdminSubmit', genres);
            console.log('subbmitted votes on timer=0')
    }
    });
    },[]);
    return (
    <div>
    {isGenrePage ? <div><Movies /></div>:
        <div>
        <center>Vote on Genres</center>
        {startTime}
        {genreList.map((g, index)=>(
        <div>
            <ul>Genre {g}</ul>
            <button onClick={() => {Genres(index, true)}}>Like</button>
            <button onClick={() => {Genres(index, false)}}>Dislike</button>
        </div>
        ))}
        <div>
            <button onClick={() => {socket.emit('onSubmit', genres); setGenrePage(true);}}>Submit</button>
        </div>
        </div>
    }
    </div>
    );
}