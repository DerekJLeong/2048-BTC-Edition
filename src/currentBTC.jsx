import React, { Component } from "react";
import "./App.css";

class CurrentBTC extends Component {
   render() {
      return (
         <div className="btc_container">
            <h1>${this.props.BTCUSD}</h1>
         </div>
      );
   }
}

export default CurrentBTC;
