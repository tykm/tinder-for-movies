import React, { useState, useEffect } from "react";
import { socket } from "./App.js";
import { Winner } from "./Winner.js";
import { useTimer } from "react-timer-hook";
import { Radio } from "./Radio.js";
export function Movies({genreList, admin, currUser, room}) {
  const [movies, setMovies] = useState(Array(10).fill(null)); // sets board to empty array
  const [movieList, setMovieList] = useState(Array(10).fill(null));
  const [isMoviePage, setMoviePage] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 15);
  const { seconds, isRunning } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      setTimerEnd(true);
      console.log(movies, "Before timerEnd");
      socket.emit("onSubmitMovies", {movies, room});
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
          <Winner genreList={genreList} admin={admin} currUser={currUser} room={room}/>{" "}
        </div>
      ) : isMoviePage ? (
        <div>Waiting for others to finish!</div>
      ) : (
        <div>
          <center>Vote on Movies</center>
          {seconds}
          {movieList.map((m, index) => (
            <div>
              <ul> {m} </ul>
              <Radio  Genres={Movies} index = {index} />
            </div>
          ))}
          <div>
            <button
              onClick={() => {
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
export default Movies;