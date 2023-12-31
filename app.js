const express = require('express');
const path = require('path');
const tiktokDl = require("@sasmeee/tkdl");
const ytdl = require('ytdl-core');
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
        const availableAudioFormats = audioFormats.map(format => ({
            itag: format.itag,
            bitrate: format.audioBitrate,
            mimeType: format.mimeType,
            url: format.url,
            codecs: format.codecs
        }));

        const availableQualities = videoFormats.map(format => ({
            itag: format.itag,
            quality: format.qualityLabel || format.quality,
            mimeType: format.mimeType,
            url: format.url,
            codecs: format.codecs
        }));

        const videoBasicDetails = {
            title: videoTitle,
            thumbnail: videoThumbnail,
            qualities: availableQualities,
            audio: availableAudioFormats 
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

