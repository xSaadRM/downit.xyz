import React from "react";
import "../styles/HeaderStyles.css"
const Header = () => {
  return (
    <div className="header">
      <div className="siteLogo">
        <img src="./logo512.png"></img>
        <h1>ProDown.net</h1>
      </div>
    </div>
  );
};

export default Header;
