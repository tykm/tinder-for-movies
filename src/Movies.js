import React, { useState, useEffect } from "react";
import { socket } from "./App.js";
import { Winner } from "./Winner.js";
import { useTimer } from "react-timer-hook";
import { Radio } from "./Radio.js";
import "./Genres.css";
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
         <div><center><h3>Waiting for Others to Finish!</h3></center></div>
      ) : (
        <div>
          <center><h2>Vote on Movies</h2>
          <p>Time Left to Vote: <b>{seconds}</b> seconds</p>
          {movieList.map((m, index) => (
            <div>
              <ul> <b>{m}</b> </ul>
              <Radio  Genres={Movies} index = {index} />
            </div>
          ))}
          <div>
          <br/>
            <button className="choiceButton"
              onClick={() => {
                setMoviePage(true);
              }}
            >
              Submit
            </button>
          </div>
         </center>
        </div>
      )}
    </div>
  );
}
export default Movies;