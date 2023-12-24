const ytdl = require('ytdl-core');

// YouTube video URL
const videoURL = 'https://www.youtube.com/watch?v=CgruI1RjH_c';

// Get video info
ytdl.getBasicInfo(videoURL).then(info => {
  // Extract video details
  const title = info.videoDetails.title;
  const author = info.videoDetails.author.name;
  const description = info.videoDetails.description;
  
  // Get the thumbnail URL
  const thumbnailURL = info.videoDetails.thumbnails[0].url;

  // Output video details
  console.log('Title:', title);
  console.log('Author:', author);
  console.log('Description:', description);
  console.log('Thumbnail URL:', thumbnailURL);
}).catch(err => {
  console.error('Error fetching video info:', err);
});
