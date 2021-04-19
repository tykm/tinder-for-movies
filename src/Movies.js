import React, { useState, useEffect } from 'react';
import { socket } from './App.js';
import { Winner } from './Winner.js';
export function Movies() {
    const [movies, setMovies] = useState(Array(10).fill(null)); // sets board to empty array
    const [movieList, setMovieList] = useState(['', '', '', '', '', '', '', '', '', '']); 
    const [isMoviePage, setMoviePage] = useState(false);
    const [startTime, setTime] = useState(10);
    function Movies(index, isLike) {
        const newMovies = [...movies];
        if (newMovies[index] === null) {
            newMovies[index] = isLike ? '1' : '0';
            setMovies(newMovies);
            console.log(isLike);
            }
            console.log(newMovies);
    }
    if (startTime === 0){
        setMoviePage(true);
        socket.emit('onAdminSubmit', movies);
        console.log('subbmitted votes on timer=0');
    }
    useEffect(()=>{
    socket.on('listOfGenres',(data)=>{
      console.log(data);
      setMovieList(data);
      setInterval(() => {
        setTime((prevTime) => prevTime-1);
      },1000);
    });
    
    },[]);
    return (
    <div>
     {isMoviePage ? <div><Winner /></div>:
        <div>
        {startTime}
        <center>Vote on Movies</center>
        {movieList.map((m, index)=>(
        <div>
            <ul>Movie {m}</ul>
            <button onClick={() => {Movies(index, true)}}>Like</button>
            <button onClick={() => {Movies(index, false)}}>Dislike</button>
        </div>
        ))}
        <div>
            <button onClick={() => {socket.emit('onSubmit', movies); setMoviePage(true);}}>Submit</button>
        </div>
        </div>
     }
    </div>
    );
}
