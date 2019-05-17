import React from "react";
import "./App.css";

class App extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         board: null,
         score: 0,
         gameOver: false,
         message: null
      };
   }

   // Function to iniate a blank board/game
   initBoard() {
      let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      // TODO board = placeRandomNumberFunc(placeRandomNumberFunc(board))
      this.setState({ board, score: 0, gameOver: false, message: null });
   }

   // Function called when the component mounts
   componentWillMount() {
      // When mounted calls function to iniate the board/game
      this.initBoard();

      // Adds keyboard event listening
      const body = document.querySelector("body");
      body.addEventListener("keydown", this.handleKeyDown.bind(this));
   }

   // Function to handle desigated key presses
   handleKeyDown(pressedKey) {
      const up = 38;
      const right = 39;
      const down = 40;
      const left = 37;
      const n = 78;

      if (pressedKey.keyCode === up) {
         // this.move('up');
      } else if (pressedKey.keyCode === right) {
         // this.move('right');
      } else if (pressedKey.keyCode === down) {
         // this.move('down');
      } else if (pressedKey.keyCode === left) {
         // this.move('left');
      } else if (pressedKey.keyCode === n) {
         this.initBoard();
      }
   }

   render() {
      return (
         <div>
            <div className="score">Score: {this.state.score}</div>

            <table>
               {this.state.board.map((row, i) => (
                  <Row key={i} row={row} />
               ))}
            </table>

            <p>{this.state.message}</p>
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
// Changes className according to value and displays value if >0
const Cell = ({ cellValue }) => {
   let color = "cell";
   let value = cellValue === 0 ? "" : cellValue;
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
