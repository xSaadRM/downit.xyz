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

