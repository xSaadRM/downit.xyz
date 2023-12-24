const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');

// Serve static files
app.use('/styles', express.static(path.join(__dirname, 'public/styles'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/scripts', express.static(path.join(__dirname, 'public/scripts'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Middleware to parse JSON data
app.use(express.json());

// Serve index.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Endpoint to get video information including available formats
app.post('/getVideoInfo', async (req, res) => {
    const { videoUrl } = req.body;
  
    try {
      const info = await ytdl.getInfo(videoUrl);
      const videoId = ytdl.getURLVideoID(videoUrl);
      console.log("THE VID ID: ", videoId)
      // Extract video details
      const title = info.videoDetails.title;
      const author = info.videoDetails.author.name;
      const description = info.videoDetails.description;
      const thumbnailURL = info.videoDetails.thumbnails[0].url;
  
      // Extract available formats
      const availableFormats = info.formats.map((format, index) => ({
        formatId: format.itag,
        resolution: format.qualityLabel || 'Unknown',
        videoCodec: format.hasVideo ? format.codecs : 'None',
        audioCodec: format.hasAudio ? format.audioCodecs : 'None',
        bitrate: format.bitrate
      }));
  
      // Send video details and available formats as JSON response
      res.json({
        title,
        videoId,
        author,
        description,
        thumbnailURL,
        videoUrl,
        availableFormats
      });
    } catch (err) {
      console.error('Error fetching video info:', err);
      res.status(500).json({ error: 'Error fetching video info' });
    }
  });

// Endpoint to download the video based on the format ID
app.get('/download/:videoId/:formatId', async (req, res) => {
    const { videoId, formatId } = req.params;
  
    try {
      const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
      const format = videoInfo.formats.find(format => format.itag === parseInt(formatId));
  
      if (format) {
        const filename = `${videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '')}.${format.container}`;
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Using ytdl.downloadFromInfo to download the video
        const options = { format: format };
        ytdl.downloadFromInfo(videoInfo, options).pipe(res);
      } else {
        res.status(404).send('Format not found');
      }
    } catch (error) {
      res.status(500).send('Error downloading the video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
