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

// Endpoint to get video information
app.post('/getVideoInfo', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const info = await ytdl.getBasicInfo(videoUrl);

    // Extract video details
    const title = info.videoDetails.title;
    const author = info.videoDetails.author.name;
    const description = info.videoDetails.description;
    const thumbnailURL = info.videoDetails.thumbnails[0].url;

    // Send video details as JSON response
    res.json({ title, author, description, thumbnailURL, videoUrl });
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Error fetching video info' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
