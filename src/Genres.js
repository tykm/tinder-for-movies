import React, { useState } from "react";
import { socket } from "./App.js";
import { Movies } from "./Movies.js";
import { useTimer } from "react-timer-hook";

export function Genres({ startTime, genreList, resetInterval }) {
  const [genres, setGenres] = useState(Array(10).fill(null)); // sets board to empty array
  const [isGenrePage, setGenrePage] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 10);
  const { seconds, isRunning } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      socket.emit("moviesList");
      setTimerEnd(true);
      console.log("setting timer end to true");
      socket.emit("onSubmit", genres);
    },
  });

  function Genres(index, isLike) {
    const newGenres = [...genres];
    if (newGenres[index] === null) {
      newGenres[index] = isLike ? "1" : "0";
      setGenres(newGenres);
      console.log(isLike);
    }
    console.log(newGenres);
  }

  return (
    <div>
      {timerEnd ? (
        <div>
          {" "}
          <Movies />{" "}
        </div>
      ) : isGenrePage ? (
        <div>Waiting for Others to Finish!</div>
      ) : (
        <div>
          <center>Vote on Genres</center>
          {seconds}
          {genreList.map((g, index) => (
            <div>
              <ul>Genre {g}</ul>
              <button
                onClick={() => {
                  Genres(index, true);
                }}
              >
                Like
              </button>
              <button
                onClick={() => {
                  Genres(index, false);
                }}
              >
                Dislike
              </button>
            </div>
          ))}
          <div>
            <button
              onClick={() => {
                socket.emit("onSubmit", genres);
                setGenrePage(true);
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
