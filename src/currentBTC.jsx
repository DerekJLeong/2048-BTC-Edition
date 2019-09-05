import React, { Component } from "react";
class CurrentBTC extends Component {
   render() {
      return (
         <div>
            <h2>{this.props.BTCUSD}</h2>
         </div>
      );
   }
}

export default CurrentBTC;
