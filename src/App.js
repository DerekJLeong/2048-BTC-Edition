import React from "react";
import "./App.css";
import CurrentBTC from "./currentBTC";
import Score from "./score";

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
      this.initBoard = this.initBoard.bind(this);
   }

   // Function to iniate a blank board/game
   initBoard() {
      let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      // Places two random numbers at start of game
      board = this.placeRandomStartNum(this.placeRandomStartNum(board));
      this.setState({ gameOver: false, board, score: 0 });
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
      this.getBitcoin();
      this.interval = setInterval(() => {
         this.getBitcoin();
      }, 30000);
   }
   getBitcoin() {
      fetch(API)
         .then(response => response.json())
         .then(data => this.setState({ bitcoin: data.bpi.USD.rate }));
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   handleMatchedClass(board) {
      const matchedBoard = board;
      let matchlessBoard = [];
      matchedBoard.forEach(row => {
         let newRow = [];
         row.forEach(cell => {
            cell = cell[1] ? cell[0] : cell;
            newRow.push(cell);
         });
         matchlessBoard.push(newRow);
      });

      return matchlessBoard;
   }

   // PLaces a single random starting number on a random blank coordinate on the board
   placeRandomStartNum(board) {
      const blankCoordinates = this.getBlankCoordinate(board);
      const randomBlankCoord =
         blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
      const randomStartNumber = this.getRandomStartNum();

      // 2 = new tile anmiation
      board[randomBlankCoord[0]][randomBlankCoord[1]] = [randomStartNumber, 2];

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
      const fourProbability = 0.125;
      const randomStartNumber = Math.random() < fourProbability ? 4 : 2;
      return randomStartNumber;
   }

   // Passes direction code to move board in designated direction
   move(direction) {
      // First rotates board into base workable postion
      // 0 -> left, 1 -> up, 2 -> right, 3 -> down
      let currentScore = this.state.score;

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
                  score: (currentScore += movedBoard.points)
               });
            }
         }
         if (this.checkForWin(this.state.score, this.state.bitcoin)) {
            this.setState({
               gameOver: true,
               message: "You Won! Hodl On!"
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
      let newBoard = [];
      let points = 0;

      for (let row = 0; row < oldBoard.length; row++) {
         let newRow = [];
         for (let column = oldBoard.length - 1; column >= 0; column--) {
            let currentCell = oldBoard[row][column];
            currentCell === 0
               ? newRow.push(currentCell)
               : newRow.unshift(currentCell);
         }
         newBoard.push(newRow);
      }

      for (let i = 0; i < 2; i++) {
         for (let row = 0; row < newBoard.length; row++) {
            for (let column = 0; column < newBoard.length; column++) {
               if (
                  newBoard[row][column] > 0 &&
                  newBoard[row][column] === newBoard[row][column + 1]
               ) {
                  newBoard[row][column] = [
                     newBoard[row][column] + newBoard[row][column + 1],
                     1
                  ];
                  newBoard[row][column + 1] = 0;

                  points += newBoard[row][column][0];
               } else if (
                  newBoard[row][column] === 0 &&
                  newBoard[row][column + 1] > 0
               ) {
                  newBoard[row][column] = newBoard[row][column + 1];
                  newBoard[row][column + 1] = 0;
               }
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
      let direction;

      if (pressedKey.keyCode >= 37 && pressedKey.keyCode <= 41) {
         direction = pressedKey.keyCode - 37;
         this.setState({ board: this.handleMatchedClass(this.state.board) });
         this.move(direction);
      } else if (pressedKey.keyCode === n) {
         this.initBoard();
      }
   }

   render() {
      return (
         <div className="game_container">
            <div className="top_container">
               <CurrentBTC BTCUSD={this.state.bitcoin} />
               <Score score={this.state.score} />
               <p className="intro">
                  Join the numbers together and get a score <br />
                  greater than the <b>current USD/Bitcoin price!</b>
               </p>
               <div className="reset_button" onClick={this.initBoard}>
                  New Game
               </div>
            </div>
            <div className="middle_container">
               <table className="game_board">
                  {this.state.board.map((row, rowIndex) => (
                     <tr key={rowIndex}>
                        {row.map((cell, i) => (
                           <Cell
                              key={i}
                              cellValue={cell[1] ? cell[0] : cell}
                              // cell[1] = 1(matched) = 2(new)
                              matched={cell[1] === 1 ? true : false}
                              isNew={cell[1] === 2 ? true : false}
                           />
                        ))}
                     </tr>
                  ))}
               </table>
               <Modal {...this.state} />
            </div>
            <div className="bottom_container">
               <p className="game_explanation">
                  <b>How to play:</b> Use your
                  <b> arrow keys</b> to move the tiles. When two tiles with the
                  same number touch, they
                  <b> merge into one!</b>
               </p>
               <hr />
               <p className="game_credits">
                  <b class="important">Note:</b> The game on{" "}
                  <a href="http://git.io/2048">this site</a> is the original
                  version of 2048. 2048 Bitcoin Edition is a derivative inspired
                  by the original, created by{" "}
                  <a href="http://gabrielecirulli.com" target="_blank">
                     Gabriele Cirulli
                  </a>
                  . Based on{" "}
                  <a
                     href="https://itunes.apple.com/us/app/1024!/id823499224"
                     target="_blank"
                  >
                     1024 by Veewo Studio
                  </a>{" "}
                  and conceptually similar to{" "}
                  <a href="http://asherv.com/threes/" target="_blank">
                     Threes by Asher Vollmer
                  </a>
                  .
               </p>
               <hr />
               <p>
                  Created by{" "}
                  <a href="http://derekjleong.tech/" target=" blank">
                     Derek J Leong
                  </a>
               </p>
            </div>
         </div>
      );
   }
}

function Modal(props) {
   return (
      <div>
         {props.gameOver ? (
            <div className="modal_container">
               <p className="modal_message">{props.message}</p>
            </div>
         ) : null}
      </div>
   );
}

// Renders cells
// Changes className according to value and only displays value if >0
const Cell = ({ cellValue, matched, isNew }) => {
   let classNames = "tile";
   let value = cellValue === 0 ? "" : cellValue;
   if (isNew) {
      classNames += " new";
   }
   if (matched) {
      classNames += " matched";
   }
   if (value) {
      classNames += ` color_${value}`;
   }
   if (value > 2048) {
      classNames += " color_super";
   }
   return (
      <td className="cell">
         <div className={classNames}>{value}</div>
      </td>
   );
};

export default App;
