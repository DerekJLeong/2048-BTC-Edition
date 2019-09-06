import React from "react";
import "./App.css";
import CurrentBTC from "./currentBTC";

const API = "https://api.coindesk.com/v1/bpi/currentprice.json";

class App extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         board: null,
         score: 0,
         gameOver: false,
         message: "GOOD LUCK & HODL ON",
         bitcoin: 0
      };
   }

   // Function to iniate a blank board/game
   initBoard() {
      let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      // Places two random numbers at start of game
      board = this.placeRandomStartNum(this.placeRandomStartNum(board));
      this.setState({ board, score: 0 });
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
   componentDidMount() {
      fetch(API)
         .then(response => response.json())
         .then(data => this.setState({ bitcoin: data.bpi.USD.rate }));
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
      const fourProbability = 0.175;
      const randomStartNumber = Math.random() < fourProbability ? 4 : 2;
      return randomStartNumber;
   }

   // Passes direction code to move board in designated direction
   move(direction) {
      // First rotates board into base workable postion
      // 0 -> left, 1 -> up, 2 -> right, 3 -> down
      if (!this.state.gameOver) {
         for (let i = 0; i < direction; ++i) {
            this.setState({
               board: this.counterClockwise90deg(this.state.board)
            });
         }
         const movedBoard = this.moveTiles(this.state.board);
         if (this.boardMoved(this.state.board, movedBoard.newBoard)) {
            const movedBoardWithRandom = this.placeRandomStartNum(
               movedBoard.newBoard
            );

            if (this.checkForGameOver(movedBoardWithRandom)) {
               this.setState({
                  board: movedBoardWithRandom,
                  gameOver: true,
                  message: "Game Over!"
               });
            } else {
               this.setState({
                  board: movedBoardWithRandom,
                  score: (this.state.score += movedBoard.points)
               });
            }
         }
         if (this.checkForWin(this.state.score, this.state.bitcoin)) {
            this.setState({
               gameOver: true,
               message: "You Won! Hodl on!"
            });
         }
         // Rotates board to original position
         for (var i = direction; i < 4; ++i) {
            this.setState({
               board: this.counterClockwise90deg(this.state.board)
            });
         }
      }
   }
   counterClockwise90deg(matrix) {
      let rows = matrix.length;
      let columns = matrix[0].length;
      let result = [];
      for (let row = 0; row < rows; ++row) {
         // push blank row to result matrix
         result.push([]);
         for (let column = 0; column < columns; column++) {
            // populate the blank row with the previous'
            result[row][column] = matrix[column][columns - row - 1];
         }
      }
      return result;
   }
   moveTiles(oldBoard) {
      let board = oldBoard;
      let newBoard = [];
      let points = 0;

      for (let row = 0; row < board.length; row++) {
         let newRow = [];
         for (let column = board[row].length - 1; column >= 0; column--) {
            let currentCell = board[row][column];
            currentCell === 0
               ? newRow.push(currentCell)
               : newRow.unshift(currentCell);
         }
         newBoard.push(newRow);
      }

      for (let row = 0; row < newBoard.length; row++) {
         for (let column = 0; column < newBoard.length; column++) {
            if (
               newBoard[row][column] > 0 &&
               newBoard[row][column] === newBoard[row][column + 1]
            ) {
               newBoard[row][column] =
                  newBoard[row][column] + newBoard[row][column + 1];
               newBoard[row][column + 1] = 0;
               points += newBoard[row][column];
            } else if (
               newBoard[row][column] === 0 &&
               newBoard[row][column + 1] > 0
            ) {
               newBoard[row][column] = newBoard[row][column + 1];
               newBoard[row][column] = 0;
            }
         }
      }
      return { newBoard, points };
   }
   checkForGameOver(board) {
      let up = this.counterClockwise90deg(board);
      let right = this.counterClockwise90deg(this.counterClockwise90deg(board));
      let down = this.counterClockwise90deg(
         this.counterClockwise90deg(this.counterClockwise90deg(board))
      );
      let moves = [
         this.boardMoved(board, this.moveTiles(board).newBoard),
         this.boardMoved(up, this.moveTiles(up).newBoard),
         this.boardMoved(right, this.moveTiles(right).newBoard),
         this.boardMoved(down, this.moveTiles(down).newBoard)
      ];
      return moves.includes(true) ? false : true;
   }
   boardMoved(original, updated) {
      return JSON.stringify(updated) !== JSON.stringify(original)
         ? true
         : false;
   }
   checkForWin(score, bitcoin) {
      return score >= parseFloat(bitcoin.replace(/,/g, "")) ? true : false;
   }

   // Handles desigated key presses
   handleKeyDown(pressedKey) {
      const n = 78;

      if (pressedKey.keyCode >= 37 && pressedKey.keyCode <= 41) {
         let direction = pressedKey.keyCode - 37;
         this.move(direction);
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
            <Modal {...this.state} />
            <CurrentBTC BTCUSD={this.state.bitcoin} />
         </div>
      );
   }
}

function Modal(props) {
   return <div>{props.gameOver ? <p>{props.message}</p> : null}</div>;
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
