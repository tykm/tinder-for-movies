import React, { useState, useEffect } from 'react';
export function ListItem(props) {
    const [isLike, setLike] = useState(false); // useState for if they liked 
    const [isDisLike, setDisLike] = useState(false); // useState for if they dislike
    function increment(isLike,isDisLike){
        if (isLike){

        }
    }
    return (
    <div>
    <ul>{props.name}</ul>
    <button onClick={() => setLike(!isLike)}>Like</button>
    <button onClick={() => setDisLike(!isDisLike)}>Dislike</button>
    </div>);
}