import React, { useState } from "react";
import { socket } from "./App.js";
import { Movies } from "./Movies.js";
import { useTimer } from "react-timer-hook";
import "./Genres.css";
export function Genres({ startTime, genreList, resetInterval, admin, currUser }) {
  const [genres, setGenres] = useState(Array(10).fill(null)); // sets board to empty array
  const [isGenrePage, setGenrePage] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 20);
  const { seconds, isRunning } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      socket.emit("moviesList");
      setTimerEnd(true);
      console.log("setting timer end to true");
      if (!isGenrePage) {
        socket.emit("onSubmit", genres);
      }
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
          <Movies genreList={genreList} admin={admin} currUser={currUser}/>{" "}
        </div>
      ) : isGenrePage ? (
        <div><center><h3>Waiting for Others to Finish!</h3></center></div>
      ) : (
        <div>
          <center><h2>Vote on Genres</h2>
          <p>Time Left to Vote: <b>{seconds}</b> seconds</p>
          {genreList.map((g, index) => (
            <div>
              <ul>{g}</ul>
              <button className="choiceButton" onClick={() => {
                  Genres(index, true);
                }}>
                Like
              </button>
              {" "}
              <button className="choiceButton" onClick={() => {
                  Genres(index, false);
                }}>
                Dislike
                </button>
            </div>
          ))}
          <div>
          <br/>
            <button className="choiceButton"
              onClick={() => {
                socket.emit("onSubmit", genres);
                setGenrePage(true);
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
export default Genres;
