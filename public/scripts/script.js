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
        displayVideoInfo(data);
      } catch (error) {
        videoInfoDiv.textContent = `Error: ${error.message}`;
      } finally {
        // Hide loading animation after fetching data
        loadingAnimation.style.display = 'none';
      }
    });
  
    function displayVideoInfo(data) {
        // Display video details in the HTML
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
      
        // Check if data.formats exists and is an array
        if (Array.isArray(data.formats) && data.formats.length > 0) {
          data.formats.forEach((format, index) => {
            const listItem = document.createElement('li');
            const downloadButton = document.createElement('button');
      
            downloadButton.textContent = `Download ${format.quality}`;
            downloadButton.addEventListener('click', () => {
              downloadVideo(format.url, data.title, index);
            });
      
            listItem.appendChild(downloadButton);
            downloadList.appendChild(listItem);
          });
        } else {
          const noFormatsMessage = document.createElement('p');
          noFormatsMessage.textContent = 'No available formats to download.';
          downloadList.appendChild(noFormatsMessage);
        }
      }
    });