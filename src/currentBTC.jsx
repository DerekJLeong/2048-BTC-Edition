import React, { Component } from "react";
import "./App.css";

class CurrentBTC extends Component {
   render() {
      return (
         <div className="btc_container">
            <p>${this.props.BTCUSD}</p>
         </div>
      );
   }
}

export default CurrentBTC;
