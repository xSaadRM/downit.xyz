const express = require('express');
const path = require('path');
const tiktokDl = require("@sasmeee/tkdl");
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const axios = require('axios'); // Import Axios for HTTP requests

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

app.get('/ytinfo', async (req, res) => {
    try {
        const ytUrl = req.query.ytUrl;
        let ytInfo = await ytdl.getInfo(ytUrl);
        const videoThumbnail = ytInfo.videoDetails.thumbnails[2].url;
        const videoTitle = ytInfo.videoDetails.title;
        const videoAuthor = ytInfo.videoDetails.author;

        const videoFormats = ytInfo.formats.filter(format => {
            return (
                format.hasVideo &&
                format.hasAudio &&
                format.container === 'mp4'
            );
        });

        const audioFormats = ytInfo.formats.filter(format => {
            return (
                !format.hasVideo &&
                format.hasAudio
            );
        });
        
        // Function to fetch content length of a URL
        const getContentLength = async (url) => {
            try {
                const response = await axios.head(url); // Send a HEAD request to get headers
                return response.headers['content-length']; // Extract content length
            } catch (error) {
                console.error('Error fetching content length:', error);
                return null;
            }
        };

        // Function to convert bytes to human-readable format
const formatBytes = (bytes) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Modify the code snippet within the existing logic to use the formatBytes function
const videoFormatsWithSizes = [];
for (const format of videoFormats) {
    const contentLength = await getContentLength(format.url);
    videoFormatsWithSizes.push({
        ...format,
        fileSize: contentLength ? formatBytes(parseInt(contentLength)) : null // Convert bytes to human-readable format
    });
}

const audioFormatsWithSizes = [];
for (const format of audioFormats) {
    const contentLength = await getContentLength(format.url);
    audioFormatsWithSizes.push({
        ...format,
        fileSize: contentLength ? formatBytes(parseInt(contentLength)) : null // Convert bytes to human-readable format
    });
}


        const availableQualities = videoFormatsWithSizes.map(format => ({
            itag: format.itag,
            quality: format.qualityLabel || format.quality,
            mimeType: format.mimeType,
            url: format.url,
            codecs: format.codecs,
            fileSize: format.fileSize // Include file size in the response
        }));

        const availableAudioFormats = audioFormatsWithSizes.map(format => ({
            itag: format.itag,
            bitrate: format.audioBitrate,
            mimeType: format.mimeType,
            url: format.url,
            codecs: format.codecs,
            fileSize: format.fileSize // Include file size in the response
        }));

        const videoBasicDetails = {
            title: videoTitle,
            thumbnail: videoThumbnail,
            qualities: availableQualities,
            audio: availableAudioFormats,
            author: videoAuthor 
        };

        console.log('Video Info:', videoBasicDetails);
        res.send({ videoDetails: videoBasicDetails });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching video info' });
    }
});

app.get('/download-yt', async (req, res) => {
    try {
        const userItag = req.query.itag;
        const userYtUrl = req.query.ytUrl;

        if (!userItag || !userYtUrl) {
            return res.status(400).send('Please provide both itag and ytUrl parameters.');
        }

        const userOptions = {
            quality: userItag,
        };

        const userVideoInfo = await ytdl.getInfo(userYtUrl);
        const uvideoFormat = ytdl.chooseFormat(userVideoInfo.formats, userOptions);

        if (!uvideoFormat) {
            return res.status(404).send('Video format not found.');
        }

        const videoTitle = userVideoInfo.videoDetails.title;
        if (uvideoFormat.hasVideo) {
            var outputFileName = `${videoTitle}.${uvideoFormat.container}`;
        } else outputFileName = `${videoTitle}.mp3`;
        res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
        res.setHeader('Content-Type', `${uvideoFormat.mimeType}`);

        ytdl(userYtUrl, userOptions).pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/tikinfo', async (req, res) => {
    try {
      const tikUrl = req.query.tikUrl;
  
      if (!tikUrl) {
        return res.status(400).json({ error: 'Missing TikTok URL' });
      }
  
      const dataList = await tiktokDl(tikUrl);
  
      if (Array.isArray(dataList) && dataList.length > 0) {
        const firstItem = dataList[0];
  
        const info = {
          title: firstItem.title || "Title not found in the fetched data.",
          thumbnail: firstItem.thumbnail || "Thumbnail not found in the fetched data.",
          sd: firstItem.sd || "SD link not found in the fetched data.",
          hd: firstItem.hd || "HD link not found in the fetched data.",
          audio: firstItem.audio || "Audio link not found in the fetched data.",
          author: firstItem.author || "Author not found in the fetched data."
        };
  
        res.json(info);
  
      } else {
        res.status(404).json({ error: 'Empty or invalid data received.' });
      }
      
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: 'An error occurred while fetching TikTok data.' });
      // Handle errors here
    }
  });

const PORT = process.env.PORT || 80; 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

