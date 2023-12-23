const express = require('express');
const yt = require('yt-converter');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Function to sanitize the filename
const sanitizeFilename = (filename) => {
  return filename.replace(/[^\w\d\u0600-\u06FF.]/g, '_').replace(/\s+/g, '_');
  // Replace non-alphanumeric characters, including spaces, with underscores
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', async (req, res) => {
  try {
    const { videoURL, format } = req.body;

    if (!videoURL || !format) {
      return res.status(400).send('Please provide a video URL and select a format');
    }

    let converterFunc;
    let fileExtension;
    if (format === 'mp4') {
      converterFunc = yt.convertVideo;
      fileExtension = 'mp4';
    } else if (format === 'mp3') {
      converterFunc = yt.convertAudio;
      fileExtension = 'mp3';
    } else {
      return res.status(400).send('Invalid format selected');
    }

    const info = await yt.getInfo(videoURL);
    const { title } = info;

    // Store original and sanitized filenames separately
    const originalTitle = title;
    const sanitizedTitle = sanitizeFilename(title);

    const onData = (data) => {
      console.log('Data:', data); // Handle data updates during conversion if needed
    };

    const onClose = async () => {
      console.log('Conversion finished');

      try {
        const filePath = path.join(__dirname, `${sanitizedTitle}.${fileExtension}`);

        // Set appropriate headers and send the file for download
        res.setHeader('Content-Disposition', `attachment; filename=untitled.${fileExtension}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.sendFile(filePath);

      } catch (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error sending file');
      }
    };

    await converterFunc({
      url: videoURL,
      itag: format === 'mp4' ? 136 : 140,
      directoryDownload: __dirname,
      title: sanitizedTitle // Use the sanitized title for saving the file
    }, onData, onClose);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`An error occurred: ${error.message}`);
  }
});

const PORT = process.env.PORT || 20849;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
