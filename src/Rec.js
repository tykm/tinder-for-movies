import React from 'react';

export function Receive(){
    // will need props to get information from the other component
    // let changes while const will not be reassigned
    const movieL = ["The array of movies received to Rec.js"]
    const voteL = ["However the votes for each movie will be sent"]
    let pos = 0 //The position of the movie with the highest rating; will be needed for the next sprint
    // { props.array } for the arrays and a useEffect to receive API information from the back-end
    // probably need to resize the image and create a stylesheet
    return (
        <div>
            <p> Movie name here... {movieL[pos]}</p>
            <img src="www.defareallink.com" />
            <p> 
                User rating: {voteL[pos]}<br/>
                Movie Description <br/>
                <a href="www.defareallink.com"> Movie review </a> <br/>
                <a href="www.defareallink.com"> Movie trailer </a>
            </p>
        </div>
    );
}
/*
What this needs:
- A way to display the movie that came in first
- A lot of other stuff they added about the movie
- - Like description and picture for the movie
- - Link to the movie review and to a trailer
- - The number of likes versus dislikes from the users for that movie
---------------------------------------------------------------------------
What I need to create:
- a way to traverse the array and keep the other array information in sync
---------------------------------------------------------------------------
Things I need :
- The array of the movies sent to this component 
- The votes for each movies
- The API data to get the movie information (ie trailer, review, picture, description)

*Maybe start adding the buttons and other stuff for the next sprint
*Should make a return to login page button even though that only needs to be made for the next sprint

*/
