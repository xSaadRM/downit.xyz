document.addEventListener('DOMContentLoaded', () => {
    const videoThumbnailElem = document.getElementById('videoThumbnail');
    const htmlidkThumbnail = document.getElementById('videoThumbnail'); // Fixed variable name for consistency
    htmlidkThumbnail.style.display = 'none';
    const form = document.querySelector('form');
    const videoInfo = document.getElementById('videoInfo');
    const videoTitleElem = document.getElementById('videoTitle');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formatsBtnsElm = document.getElementById('formatsBtns');
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const inputUrl = document.getElementById('urlInput').value;

        // Regular expressions to match YouTube and TikTok URLs
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.*/i;
        const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/.*/i;

        let urlType = '';
        if (youtubeRegex.test(inputUrl)) {
            urlType = 'youtube';
        } else if (tiktokRegex.test(inputUrl)) {
            urlType = 'tiktok';
        } else {
            modal.style.display = 'block';
            return;
        }

        try {
            loadingIndicator.style.display = 'block'; // Show loading animation
            videoInfo.style.display = 'none'; // Hide video info while loading
            formatsBtnsElm.innerHTML = '';

            if (urlType === 'youtube') {
                const response = await fetch(`/ytinfo?ytUrl=${inputUrl}`);
                const data = await response.json();

                if (data.videoDetails) {
                    const { title, thumbnail, qualities, audio } = data.videoDetails;
                    videoTitleElem.textContent = title;
                    videoThumbnailElem.src = thumbnail;
                    videoThumbnailElem.style.display = 'block'; // Show video thumbnail
                    videoInfo.style.display = 'block';

                    qualities.forEach((format) => {
                        const formatButton = document.createElement('button');

                        formatButton.textContent = `${format.quality} - video/mp4`;
                        formatButton.addEventListener('click', () => {
                            window.open(`/download-yt?itag=${format.itag}&ytUrl=${inputUrl}`);
                        });
                        formatsBtnsElm.appendChild(formatButton); // Append the button to the container
                    });

                    audio.forEach((format) => {
                        const formatButton = document.createElement('button');
                        formatButton.textContent = `${format.bitrate}kbps - audio`;
                        formatButton.addEventListener('click', () => {
                            window.open(`/download-yt?itag=${format.itag}&ytUrl=${inputUrl}`);
                        });
                        formatsBtnsElm.appendChild(formatButton); // Append the button to the container
                    });
                }
            } else if (urlType === 'tiktok') {
                // Handle TikTok URL processing
                // Add your TikTok URL processing logic here
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error display if needed
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading animation
        }
    });

    // Close the pop-up when the close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
