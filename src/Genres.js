import React, { useState } from "react";
import { socket } from "./App.js";
import { Movies } from "./Movies.js";
import { Radio } from "./Radio.js";
import { useTimer } from "react-timer-hook";
import "./Genres.css";
export function Genres({ genreList, admin, currUser, room, email, setLog }) {
  const [genres, setGenres] = useState(Array(10).fill(null)); // sets board to empty array
  const [isGenrePage, setGenrePage] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  
  console.log("Here is genreList ")

  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 45);
  const { seconds } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      setTimerEnd(true);
      console.log("setting timer end to true");
      if (!isGenrePage) {
        socket.emit("onSubmit", { genres, room });
      }
      socket.emit("moviesList", room);
    },
  });

  function Genres(index, isLike) {
    const newGenres = [...genres];
    if (newGenres[index] === null) {
      newGenres[index] = isLike ? "1" : "0";
      setGenres(newGenres);
    } else if (newGenres[index] === "1" && !isLike) {
      newGenres[index] = "0";
      setGenres(newGenres);
    } else if (newGenres[index] === "0" && isLike) {
      newGenres[index] = "1";
      setGenres(newGenres);
    }
    console.log(newGenres);
  }

  return (
    <div>
      {timerEnd ? (
        <div>
          {" "}
          <Movies
            genreList={genreList}
            admin={admin}
            currUser={currUser}
            room={room}
            email={email}
            setLog={setLog}
          />{" "}
        </div>
      ) : isGenrePage ? (
        <div>
          <center>
            <h3>Waiting for Others to Finish!</h3>
          </center>
        </div>
      ) : (
        <div>
          <center>
            <h2>Vote on Genres</h2>
            <p>
              Time Left to Vote: <b>{seconds}</b> seconds
            </p>
            {genreList.map((g, index) => (
              <div>
                <ul>
                  {" "}
                  <b>{g}</b>
                </ul>{" "}
                <Radio Genres={Genres} index={index} />
              </div>
            ))}
            <div>
              <br />
              <button
                className="choiceButton"
                onClick={() => {
                  socket.emit("onSubmit", { genres, room });
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
