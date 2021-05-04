import React, { useState, useEffect } from "react";
import { socket, App } from "./App.js";
import Everyone from "./Everyone.js";
import "./Winner.css";
//THERE ARE 4 WARNINGS FOR WINNER.JS, IDK WHAT HAPPENS IF YOU DELETE THEM
export function Winner({ genreList, admin, currUser, room, email }) {
  const [leaves, setLeave] = useState(false);
  const [reges, setRegen] = useState(false);
  const [info, setInfo] = useState([]);
  const [decline, isDecline] = useState(0);
  const [genres, setGenres] = useState(Array(10).fill(null));
  let movieL, userL, voteL, pic, desc;
  useEffect(() => {
    socket.on("movieWinner", (data) => {
      setInfo(data);
      console.log(data);
    });
    socket.on("onDecline", (data) => {
      isDecline(data + 1);
      console.log(isDecline);
    });
    socket.on("restartTrue", (data) => {
      console.log("Admin restart in winner.js!");
      console.log(data);
      setRegen(true);
    });
  }, []);
  //[name, number of like, rating, picture, dezcription]
  // will need props to get information from the other component
  // let changes while const will not be reassigned
  if (decline === 0) {
    movieL = info[0];
    userL = info[1];
    voteL = info[2];
    pic = info[3];
    desc = info[4];
  } else if (decline === 1) {
    movieL = info[5];
    userL = info[6];
    voteL = info[7];
    pic = info[8];
    desc = info[9];
  } else if (decline === 2) {
    movieL = info[10];
    userL = info[11];
    voteL = info[12];
    pic = info[13];
    desc = info[14];
  }
  function leave() {
    setLeave(true);
  }
  function regen() {
    setRegen(true);
  }
  console.log(currUser, "this is the currUser");
  console.log(admin, "this is the admin");
  const page = (
    <div>
      <center>
        <h1>Tinder for Movies</h1>
        <h2>Winning Movie: {movieL}</h2>
        <img src={pic} alt="Movie Poster" />
        <p>
          User likes: {userL}
          <br />
          User rating: {voteL}
          <br />
          <div className="desc">
            Movie Description: <br />
            {desc} <br />
          </div>
        </p>
        <button className="login" onClick={leave}>
          {" "}
          Return to Login{" "}
        </button>{" "}
        {currUser === admin && decline < 2 ? (
          <div>
            <button
              className="genres"
              onClick={() => {
                regen();
                socket.emit("restartGame", room);
              }}
            >
              Restart Game
            </button>{" "}
            <button
              className="decline"
              onClick={() => {
                isDecline((prev) => prev + 1);
                console.log(decline, "Decline was Clicked");
                socket.emit("onDecline", { decline, room });
              }}
            >
              Decline
            </button>
          </div>
        ) : null}
      </center>{" "}
      <br />
    </div>
  );
  if (leaves === false && reges === false) {
    return page;
  } else if (leaves === true) {
    return (
      <div>
        <App />
      </div>
    );
  } else if (reges === true) {
    return (
      <div>
        <Everyone currUser={currUser} email={email} room={room} />
      </div>
    );
  }
}
export default Winner;
