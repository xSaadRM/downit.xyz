const express = require("express");
const path = require("path");
const ytdl = require("ytdl-core");
const getFBInfo = require("@xaviabot/fb-downloader");
const axios = require("axios");
const winston = require("winston");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { format } = require('date-fns');


const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Configure the logger
const logFilePath = path.join(__dirname, `logs/error_${format(new Date(), 'yyyy-MM-dd')}.log`);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath, level: "error" }),
  ],
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  logger.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const pathToSitemap = path.join(__dirname, "sitemap.xml");

app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  res.sendFile(pathToSitemap);
});

app.get("/ytinfo", async (req, res, next) => {
  try {
    const ytUrl = req.query.ytUrl;
    let ytInfo = await ytdl.getInfo(ytUrl);
    const videoThumbnail = ytInfo.videoDetails.thumbnails[2].url;
    const videoTitle = ytInfo.videoDetails.title;
    const videoAuthor = ytInfo.videoDetails.author;

    const videoFormats = ytInfo.formats.filter((format) => {
      return format.hasVideo && format.hasAudio && format.container === "mp4";
    });

    const audioFormats = ytInfo.formats.filter((format) => {
      return !format.hasVideo && format.hasAudio;
    });

    // Function to fetch content length of a URL
    const getContentLength = async (url) => {
      try {
        const response = await axios.head(url); // Send a HEAD request to get headers
        return response.headers["content-length"]; // Extract content length
      } catch (error) {
        console.error("Error fetching content length:", error);
        return null;
      }
    };

    // Function to convert bytes to human-readable format
    const formatBytes = (bytes) => {
      if (bytes === 0) {
        return "0 Bytes";
      }
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Modify the code snippet within the existing logic to use the formatBytes function
    const videoFormatsWithSizes = [];
    for (const format of videoFormats) {
      const contentLength = await getContentLength(format.url);
      videoFormatsWithSizes.push({
        ...format,
        fileSize: contentLength ? formatBytes(parseInt(contentLength)) : null, // Convert bytes to human-readable format
      });
    }

    const audioFormatsWithSizes = [];
    for (const format of audioFormats) {
      const contentLength = await getContentLength(format.url);
      audioFormatsWithSizes.push({
        ...format,
        fileSize: contentLength ? formatBytes(parseInt(contentLength)) : null, // Convert bytes to human-readable format
      });
    }
    const ytVidID = uuidv4();
    const availableQualities = videoFormatsWithSizes.map((format) => ({
      itag: format.itag,
      quality: format.qualityLabel || format.quality,
      mimeType: format.mimeType,
      url: `/vdl/${ytVidID}?&f=${format.qualityLabel}`,
      codecs: format.codecs,
      fileSize: format.fileSize, // Include file size in the response
    }));

    const availableAudioFormats = audioFormatsWithSizes.map((format) => ({
      itag: format.itag,
      bitrate: `${format.audioBitrate} kbps`,
      mimeType: format.mimeType,
      url: `/vdl/${ytVidID}?&f=audio`,
      codecs: format.codecs,
      fileSize: format.fileSize, // Include file size in the response
    }));

    const videoBasicDetails = {
      title: videoTitle,
      thumbnail: videoThumbnail,
      qualities: availableQualities,
      audio: availableAudioFormats,
      author: videoAuthor,
    };
    res.send({ videoDetails: videoBasicDetails });
    const _360pArray = videoFormats.find(format => format.qualityLabel == '360p');
    const _720pArray = videoFormats.find(format => format.qualityLabel == '720p');
    const audioArray = audioFormats.find(format => format.audioBitrate == '160' || format.audioBitrate == '128')
    const info = {
      _360p: _360pArray.url,
      _720p: _720pArray.url,
      audio: audioArray.url
    }
    fs.writeFileSync(path.join(__dirname, `data/users/VidIDs/${ytVidID}.json`), JSON.stringify(info))
  } catch (error) {
    console.error("Error fetching YouTube video info:", error);
    logger.error("Error fetching YouTube video info:", error);
    res.status(500).json({ error: `${error}` });
    // You can also pass the error to the next middleware for centralized handling
    next(error);
  }
});

app.get("/download-yt", async (req, res, next) => {
  try {
    const userItag = req.query.itag;
    const userYtUrl = req.query.ytUrl;

    if (!userItag || !userYtUrl) {
      return res
        .status(400)
        .send("Please provide both itag and ytUrl parameters.");
    }

    const userOptions = {
      quality: userItag,
    };

    const userVideoInfo = await ytdl.getInfo(userYtUrl);
    const uvideoFormat = ytdl.chooseFormat(userVideoInfo.formats, userOptions);

    if (!uvideoFormat) {
      return res.status(404).send("Video format not found.");
    }

    const videoTitle = encodeURIComponent(userVideoInfo.videoDetails.title);
    if (uvideoFormat.hasVideo) {
      var outputFileName = `${videoTitle}.${uvideoFormat.container}`;
    } else outputFileName = `${videoTitle}.mp3`;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${outputFileName}"`
    );
    res.setHeader("Content-Type", `${uvideoFormat.mimeType}`);

    ytdl(userYtUrl, userOptions).pipe(res);
  } catch (error) {
    console.error("Error downloading YouTube video:", error);
    logger.error("Error downloading YouTube video:", error);
    res.status(500).json({ error: "Internal Server Error" });
    // You can also pass the error to the next middleware for centralized handling
    next(error);
  }
});

app.get("/tikinfo", async (req, res, next) => {
  try {
    const tikUrl = req.query.tikUrl;

    if (!tikUrl) {
      return res.status(400).json({ error: "Missing TikTok URL" });
    }
    try {
      const response = await fetch("https://lovetik.com/api/ajax/search", {
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua":
            '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          Referer: "https://lovetik.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `query=${tikUrl}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Check if the expected properties exist before accessing them
      if (
        data &&
        data.vid &&
        data.cover &&
        data.desc &&
        data.author &&
        data.author_name &&
        data.links
      ) {
        // Filtering and accessing links array based on format (ft)
        const mp4Links = data.links.filter((link) => link.ft === "1");
        let tiktok1080p;
        let tiktok720p;
        if (mp4Links.length > 0) {
          tiktok1080p = mp4Links[0];
          if (mp4Links.length > 1) {
            tiktok720p = mp4Links[1];
          } else {
            res.json({ error: "Only one MP4 Link Found" });
          }
        } else {
          res.json({ error: "No MP4 Links Found" });
        }
        const mp3Link = data.links.find((link) => link.ft === "3"); // Use find instead of filter for a single element
        const uservidID = uuidv4();
        const uservidIDjsonPath = `data/users/VidIDs/${uservidID}.json`;
        const info = {
          vidID: data.vid,
          title: data.desc || "Title not found in the fetched data.",
          thumbnail: data.cover || "Thumbnail not found in the fetched data.",
          sd: tiktok720p ? `${uservidID}?&f=720p` : "SD link not found in the fetched data.",
          hd: tiktok1080p ? `${uservidID}?&f=1080p` : "HD link not found in the fetched data.",
          audio: mp3Link ? `${uservidID}?&f=audio` : "Audio link not found in the fetched data.",
          author: data.author || "Author not found in the fetched data.",
          authorName: data.author_name || "Author Name not found in the fetched data.",
        };
        res.json(info);
        info._720 = tiktok720p.a;
        info._1080 = tiktok1080p.a;
        info.audio = mp3Link.a;
        fs.writeFileSync(uservidIDjsonPath, JSON.stringify(info, null, 2));

        /* DEUGGIN ONLY !!! 

        Writing the response data to a JSON file*/
        const jsonFileName = path.join(__dirname, '/debugging/lovetikAPI-response.json');
        fs.writeFile(
          jsonFileName,
          JSON.stringify(data, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.error("Error writing to JSON file:", writeErr);
            } else {
              console.log(`Response data written to ${jsonFileName}`);
            }
          }
        );
      } else {
        console.error("Error: Video unavailable");
        res.status(500).json({ error: "Video unavailable" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error fetching TikTok data:", error);
    logger.error("Error fetching TikTok data:", error);
    res.status(500).json(error);
    next(error);
  }
});

app.get("/vdl/:ressourceID", async (req, res, next) => {
  try {
    ressourceID = req.params.ressourceID;
    requestedFormat = req.query.f;
    const ressourceIDjsonPath = path.join(__dirname, `data/users/VidIDs/${ressourceID}.json`);
    const data = fs.readFileSync(ressourceIDjsonPath, "utf8");
    const info = JSON.parse(data);
    let tikUrl;
    if (requestedFormat === "360p") {
      tikUrl = info._360p
    } else if (requestedFormat === "720p") {
      tikUrl = info._720;
    } else if (requestedFormat === "1080p") {
      tikUrl = info._1080;
    } else if (requestedFormat === "audio") {
      tikUrl = info.audio;
    } else {
      res.status(400).json({ error: "Invalid format" });
      return;
    }
    const response = await axios.get(tikUrl, { responseType: "stream" });
    if (response.status === 404) {
      console.error("TikTok video not found:", tikUrl);
      throw new Error("TikTok video not found");
    }
    let fileType;
    if (requestedFormat == "720p" || "1080p"|| "360p") {
      fileType = "mp4";
      res.setHeader("Content-Type", "video/mp4");
    } else if (requestedFormat == "audio") {
      fileType = "mp3";
      res.setHeader("Content-Type", "audio/mp3");
    }
    const tikFileName = `Downit.xyz - ${requestedFormat} - ${encodeURIComponent(info.title)}.${fileType}`
    res.setHeader("Content-Disposition", `attachment; filename=${tikFileName}`);
    res.status(200);
    // Pipe the TikTok video response to the Express response
    response.data.pipe(res);
    // Optionally, you can handle errors if the download fails
    response.data.on("error", (err) => {
      console.error("Error downloading TikTok video:", err.message);
      res.status(500).json({ error: "Error downloading TikTok video" });
    });
    // Optionally, you can handle the end of the stream
    response.data.on("end", () => {
      console.log("TikTok video download completed");
    });
  } catch (error) {
    console.error("Error downloading TikTok video:", error);
    res.status(500).json({ error: "Internal Server Error" });
    // You can also pass the error to the next middleware for centralized handling
    next(error);
  }
});

app.get("/fb", async (req, res, next) => {
  try {
    const userFBUrl = req.query.Url;
    const result = await getFBInfo(userFBUrl);
    console.log("Result:", result);
    res.json(result);
  } catch (error) {}
});

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
