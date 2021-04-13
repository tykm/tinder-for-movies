import React from 'react';

export function ListItem(props) {
    return (
    <div>
    <ul>{props.name}</ul>
    <button>Like</button>
    <button>Dislike</button>
    </div>);
}