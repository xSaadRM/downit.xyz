document.addEventListener('DOMContentLoaded', function() {
    const videoForm = document.getElementById('videoForm');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const videoInfoDiv = document.getElementById('videoInfo');
  
    videoForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const videoURL = document.getElementById('videoURL').value;
      // Show loading animation
      loadingAnimation.style.display = 'block';
      videoInfoDiv.innerHTML = ''; // Clear any existing content
  
      try {
        
        
  
        const response = await fetch(`/getVideoInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ videoUrl: videoURL })
        });
  
        const data = await response.json();
        const videoId = data.videoId;
        displayVideoInfo(data, videoId); // Pass videoId to display function
      } catch (error) {
        videoInfoDiv.textContent = `Error: ${error.message}`;
      } finally {
        // Hide loading animation after fetching data
        loadingAnimation.style.display = 'none';
      }
    });
    function displayVideoInfo(data) {
      const videoDetailsContainer = document.getElementById('videoInfo');
      videoDetailsContainer.innerHTML = `
        <div style="text-align: center;">
          <h2>Title: ${data.title}</h2>
          <p>Author: ${data.author}</p>
        </div>
        <div class="thumbnail-container">
          <img src="${data.thumbnailURL}" alt="Thumbnail">
        </div>
        <div class="description-container">
          <p>Description:</p>
          <div class="description-scroll">${data.description}</div>
        </div>
        <div class="download-container">
          <h3>Available Resolutions:</h3>
          <ul id="downloadList"></ul>
        </div>
      `;
  
      const downloadList = document.getElementById('downloadList');

      if (Array.isArray(data.availableFormats) && data.availableFormats.length > 0) {
        data.availableFormats.forEach((format, index) => {
          const listItem = document.createElement('li');
          const downloadButton = document.createElement('button');
  
          downloadButton.textContent = `Download ${format.resolution}`;
          downloadButton.addEventListener('click', async (event) => {
            const videoId = data.videoId;
              await initiateVideoDownload(format.formatId, videoId);
            }),
          listItem.appendChild(downloadButton);
          downloadList.appendChild(listItem);
        });
      } else {
        const noFormatsMessage = document.createElement('p');
        noFormatsMessage.textContent = 'No available formats to download.';
        downloadList.appendChild(noFormatsMessage);
      }
    }
  
    async function initiateVideoDownload(formatId, videoId) {
      try {
        const response = await fetch(`/download/${videoId}/${formatId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const blob = await response.blob();
        downloadBlob(blob, `${videoId}.mp4`);
      } catch (error) {
        console.error('Error downloading the video:', error);
        // Handle errors or display an error message to the user
      }
    }

    function downloadBlob(blob, filename) {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  
  });