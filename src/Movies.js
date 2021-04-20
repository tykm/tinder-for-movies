import React, { useState, useEffect } from "react";
import { socket } from "./App.js";
import { Winner } from "./Winner.js";
import { useTimer } from "react-timer-hook";
export function Movies() {
  const [movies, setMovies] = useState(Array(10).fill(null)); // sets board to empty array
  const [movieList, setMovieList] = useState(Array(10).fill(null));
  const [isMoviePage, setMoviePage] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 10);
  const { seconds, isRunning } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      setTimerEnd(true);
      console.log(movies, "Before timerEnd");
      socket.emit("onSubmitMovies", movies);
    },
  });
  function Movies(index, isLike) {
    const newMovies = [...movies];
    if (newMovies[index] === null) {
      newMovies[index] = isLike ? "1" : "0";
      setMovies(newMovies);
      console.log(isLike);
    }
    console.log(newMovies);
  }

  useEffect(() => {
    socket.on("moviesList", (data) => {
      console.log(data);
      setMovieList(data);
    });
  }, []);
  return (
    <div>
      {timerEnd ? (
        <div>
          {" "}
          <Winner />{" "}
        </div>
      ) : isMoviePage ? (
        <div>Waiting for others to finish!</div>
      ) : (
        <div>
          {seconds}
          <center>Vote on Movies</center>
          {movieList.map((m, index) => (
            <div>
              <ul>Movie {m}</ul>
              <button
                onClick={() => {
                  Movies(index, true);
                }}
              >
                Like
              </button>
              <button
                onClick={() => {
                  Movies(index, false);
                }}
              >
                Dislike
              </button>
            </div>
          ))}
          <div>
            <button
              onClick={() => {
                socket.emit("onSubmitMovies", movies);
                console.log(movies);
                setMoviePage(true);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
