import React, { useState } from "react";
import { socket } from "./App.js";
export function Radio({ radio,Genres, setRadio, index }) {
    return(
        <div><form>
              <label>Like</label>
              <input type="radio"
              value = "Like"
              checked = {radio==="Like"}
              name = {index}
              onChange = {(event)=>{ setRadio(event.target.value); }
              }
              onClick={() => { 
              Genres(index, true);}}
              />
              <label>Dislike</label>
              <input type="radio"
              checked = {radio==="Dislike"}
              name = {index}
              value = "Dislike"
              onChange = {(event)=>{ setRadio(event.target.value);}}
              onClick={() => { Genres(index, false);}}
              /> 
        </form>
        </div>
              )
}
export default Radio;