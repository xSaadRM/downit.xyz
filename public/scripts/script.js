// Function to convert image to data URL
function getImageDataURL(url, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous'; // Enable CORS for the image
  img.onload = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL('image/png');
    callback(dataURL);
  };
  img.src = url;
}

// Save image data URL to localStorage
function saveImageToLocalStorage(imageURL) {
  getImageDataURL(imageURL, function(dataURL) {
    try {
      localStorage.setItem('savedImage', dataURL);
      console.log('Image saved to localStorage!');
    } catch (e) {
      console.log('LocalStorage is full, or the image is too large to store.');
    }
  });
}

    // Function to render video history in the history menu
    const renderVideoHistory = () => {
        const historyMenu = document.querySelector('.history-menu ul');
        historyMenu.innerHTML = ''; // Clear previous history

        // Retrieve video history from local storage
        const videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];

        // Iterate through video history and create list items with thumbnails and titles
        videoHistory.forEach((video, index) => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            const thumbnailImg = document.createElement('img');
            
            // Set thumbnail source and alt text
            thumbnailImg.src = video.thumbnail;
            thumbnailImg.alt = 'Thumbnail';
            
            // Set the anchor href to the video URL
            anchor.href = video.url;
            
            // Set the anchor text to the video title
            anchor.textContent = video.title;
            
            // Append thumbnail image and anchor to list item
            listItem.appendChild(thumbnailImg);
            listItem.appendChild(anchor);
            
            // Append list item to history menu
            historyMenu.appendChild(listItem);
        });
    };

