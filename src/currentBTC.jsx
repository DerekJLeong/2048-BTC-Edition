import React, { Component } from "react";
import "./App.css";

class CurrentBTC extends Component {
   numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }
   render() {
      let roundedBTC = parseFloat(
         this.props.BTCUSD.toString().replace(/,/g, "")
      ).toFixed(2);
      return (
         <div className="btc_container">
            <div className="btc_img"></div>
            <p>${this.numberWithCommas(roundedBTC)}</p>
         </div>
      );
   }
}

export default CurrentBTC;
