import React from "react";
import "./App.css";

class App extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         board: null
      };
   }

   // Function to iniate a blank board/game
   initBoard() {
      let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      // Places two random numbers at start of game
      board = this.placeRandomStartNum(this.placeRandomStartNum(board));
      this.setState({ board });
   }

   // Function called when the component mounts
   componentWillMount() {
      // When mounted
      // Calls function to iniate the board/game
      this.initBoard();
      // Keyboard event listening
      const body = document.querySelector("body");
      body.addEventListener("keydown", this.handleKeyDown.bind(this));
   }

   // PLaces a single random starting number on a random blank coordinate on the board
   placeRandomStartNum(board) {
      const blankCoordinates = this.getBlankCoordinate(board);
      const randomBlankCoord =
         blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
      const randomStartNumber = this.getRandomStartNum();

      board[randomBlankCoord[0]][randomBlankCoord[1]] = randomStartNumber;

      return board;
   }
   // Interates over each row and each column of said row, if the value is strictly '0'
   // then the blank coordinate gets pushed to an array which is later returned from the function
   // '0' = Blank
   getBlankCoordinate(board) {
      const blankCoordinates = [];

      for (let row = 0; row < board.length; row++) {
         for (let column = 0; column < board[row].length; column++) {
            if (board[row][column] === 0) {
               blankCoordinates.push([row, column]);
            }
         }
      }
      return blankCoordinates;
   }
   // Generates a random number from given array of starting numbers and returns it
   getRandomStartNum() {
      const startingNumbers = [2, 4];
      const randomStartNumber =
         startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
      return randomStartNumber;
   }

   // Handles desigated key presses
   handleKeyDown(pressedKey) {
      const n = 78;

      if (pressedKey.keyCode >= 37 && pressedKey.keyCode <= 41) {
         var direction = pressedKey.keyCode - 37;
         console.log(direction);
         this.move(direction);
      } else if (pressedKey.keyCode === n) {
         this.initBoard();
      }
   }

   render() {
      return (
         <div>
            <table>
               {this.state.board.map((row, i) => (
                  <Row key={i} row={row} />
               ))}
            </table>
         </div>
      );
   }
}

// Renders rows of cells
const Row = ({ row }) => {
   return (
      <tbody>
         <tr>
            {row.map((cell, i) => (
               <Cell key={i} cellValue={cell} />
            ))}
         </tr>
      </tbody>
   );
};

// Renders cells
// Changes className according to value and only displays value if >0
const Cell = ({ cellValue }) => {
   let color = "cell";
   let value = cellValue === 0 ? "zero" : cellValue;
   if (value) {
      color += ` color-${value}`;
   }

   return (
      <td>
         <div className={color}>
            <div className="number">{value}</div>
         </div>
      </td>
   );
};

export default App;
