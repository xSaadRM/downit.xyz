const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');

app.use('/styles', express.static(path.join(__dirname, 'public/styles'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.css') {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/getVideoInfo', async (req, res) => {
  const videoURL = req.query.videoURL;
  try {
    if (ytdl.validateURL(videoURL)) {
      const info = await ytdl.getInfo(videoURL);
      res.send(info);
    } else {
      throw new Error('Invalid YouTube URL');
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
