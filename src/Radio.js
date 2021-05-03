import React, { useState } from "react";
import "./Genres.css";
export function Radio({ Genres, index }) {
  const [radio, setRadio] = useState("");
  return (
    <div>
      <input
        className="rad"
        type="radio"
        value="Like"
        checked={radio === "Like"}
        onChange={(event) => {
          setRadio(event.target.value);
        }}
        onClick={() => {
          Genres(index, true);
        }}
      />
      <label>Like</label>
      <input
        type="radio"
        checked={radio === "Dislike"}
        value="Dislike"
        onChange={(event) => {
          setRadio(event.target.value);
        }}
        onClick={() => {
          Genres(index, false);
        }}
      />
      <label>Dislike</label>
    </div>
  );
}
export default Radio;
