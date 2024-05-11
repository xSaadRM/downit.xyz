import React from "react";
import "../../styles/HomeStyles.css";
const HomePage = () => {
  return (
    <div className="homePage">
      <div className="downloadForm">
        <form>
          <input placeholder="Past your video URL here"/>
          <button type="submit">Download</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
