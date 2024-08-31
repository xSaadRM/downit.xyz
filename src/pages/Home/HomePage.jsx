import React, { useState } from "react";
import "../../styles/HomeStyles.css";
import { getYTInfo } from "../../utils/download/youtube/piped";
import ReactPlayer from "react-player";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);

  return (
    <div className="homePage">
      <div className="downloadForm">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const getdata = await getYTInfo(url);
            setData(getdata);
          }}
        >
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Paste your video URL here"
          />
          <button type="submit">Download</button>
        </form>
      </div>
      {data && (
        <div className="videoContainer">
          <h2>{data.title}</h2>
          {console.log(data.hls)}
        </div>
      )}
    </div>
  );
};

export default HomePage;
