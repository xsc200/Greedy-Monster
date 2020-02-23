// Have the cookie monster visit every square on the board.
// The forward() function now returns an Object of the form:
// {
//     current_position: [Number, Number],
//     cookie_found: Boolean
// }
// such that current_possition is an array of the row and
// column integer coordinates of the square being advanced
// to and cookie_found is a boolean indicating if a cookie
// exists there. Example:
// {
//     current_position: [2, 3],
//     cookie_found: true
// }

// Return an array with the coordinates of all the cookies
// found. Example:
// [ [0, 1], [2, 1], [3, 3], [4, 1], [4, 2], [4, 4] ]


// Extra credit (+10 points):
// The cookie monster can smell the nearest cookie. The
// function smellCookie() returns the relative coordinates
// (a positive or negative delta for the row and column,
// example: [-2, 1]) of the nearest cookie. If there are no
// cookies left, smellCookie() returns null. Use this function
// to travel directly from cookie to cookie instead of visiting
// every square blindly.

// Part 1
let cookieCoordinatesList = [];
let moveAndCheckForCookie = (movement) => {
  let cell = movement();
  if (cell.cookieFound) {
    cookieCoordinatesList.push(cell.currentPosition);
  }
};

let lap = Math.floor(boardSize/2);
let perimeterShrink = 0;

// Each lap after the 1st lap goes around the perimeter 
// of a smaller square than the one before
for (let i = 0; i < lap; i++) {
  // Does a lap around the square
  // but stops before moving back to the 1st cell.
  for (let j = 0; j < 4; j++) {
    if (j === 3) {
      perimeterShrink++;
    }
    for (let k = 0; k < boardSize - perimeterShrink - 1; k++) {
      moveAndCheckForCookie(forward);
    }
    left();
  }

  // After the lap, moves forward into the smaller square.
  // If the boardSize is odd, moving forward after the last lap 
  // will find the smallest square of 1 cell.
  // If the boardSize is even, no need to move forward after 
  // the last lap because there is no smaller square.
  if (i != lap - 1 || boardSize%2 == 1) {
    moveAndCheckForCookie(forward);
    perimeterShrink++;
  }
}

console.log(cookieCoordinatesList);

// // Part 2
// let cookieCoordinatesList = [];
// let moveAndCheckForCookie = (movement) => {
//   let cell = movement();
//   if (cell.cookieFound) {
//     cookieCoordinatesList.push(cell.currentPosition);
//   }
// };

// let cookieCoordinates = smellCookie();
// while(cookieCoordinates) {
//   let row = cookieCoordinates[0];
//   let column = cookieCoordinates[1];

//   if (row > 0) {
//     for (let i = 0; i < row; i++) {
//       moveAndCheckForCookie(forward);
//     }
//   } else if (row < 0) {
//     aboutFace();
//     for (let i = row; i < 0; i++) {
//       moveAndCheckForCookie(forward);
//     }
//     aboutFace();
//   }

//   if (column > 0) {
//     left();
//     for (let i = 0; i < column; i++) {
//       moveAndCheckForCookie(forward);
//     }
//     right();
//   } else if (column < 0) {
//     right();
//     for (let i = column; i < 0; i++) {
//       moveAndCheckForCookie(forward);
//     }
//     left();
//   }
  
//   cookieCoordinates = smellCookie();
// }

// console.log(cookieCoordinatesList);

// Please leave comments on my github!