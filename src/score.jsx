import React, { Component } from "react";
import "./App.css";

class Score extends Component {
   render() {
      return (
         <div className="score_container">
            <p>SCORE</p>
            <p>{this.props.score}</p>
         </div>
      );
   }
}

export default Score;
