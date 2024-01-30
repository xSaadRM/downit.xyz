document.addEventListener("DOMContentLoaded", () => {
    //NavBar
    const mobileNavBar = document.getElementById("mobile-navbar");
    const bartgl = document.getElementById("barToggle");
    bartgl.addEventListener("click", () => {
      mobileNavBar.classList.toggle("active");
    });
    // Toast
    toastTxt1 = document.getElementById('toast-txt1');
    toastTxt2 = document.getElementById('toast-txt2');
    toast = document.querySelector(".toast");
    (closeIcon = document.querySelector(".close")),
    (progress = document.querySelector(".progress"));
    overlay = document.querySelector(".overlay");
let toastTimer1, toastTimer2;
const openToast = () => {
  overlay.style.display = "block";
  toast.classList.add("active");
  progress.classList.add("active");

  toastTimer1 = setTimeout(() => {
    toast.classList.remove("active");
    overlay.style.display = "none";
  }, 5000); //1s = 1000 milliseconds

  toastTimer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);
};
closeIcon.addEventListener("click", () => {
  toast.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
    overlay.style.display = "none";
  }, 300);

  clearTimeout(toastTimer1);
  clearTimeout(toastTimer2);
});

  // Dark Mode
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const toggleDarkMode = () => {
    body.classList.toggle("dark-mode");
    const isDarkModeEnabled = body.classList.contains("dark-mode");
    localStorage.setItem("darkModePreference", isDarkModeEnabled);
  };

  // Check if user has a preference saved and apply it
  const savedDarkModePreference = localStorage.getItem("darkModePreference");
  if (savedDarkModePreference === "true") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener("click", toggleDarkMode);
  //menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const leftMenu = document.querySelector(".history-menu");
  const closeMenu = () => {
    leftMenu.classList.remove("active");
  };
  const handleClickOutsideMenu = (event) => {
    if (
      !leftMenu.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      !darkModeToggle.contains(event.target)
    ) {
      closeMenu();
    }
  };

  menuToggle.addEventListener("click", () => {
    mobileNavBar.classList.remove("active");
    leftMenu.classList.toggle("active");
    renderVideoHistory();
  });
  document.addEventListener("click", handleClickOutsideMenu);
  // Event listener for the scroll event on the window
window.addEventListener("scroll", () => {
    if (leftMenu.classList.contains("active")) {
      closeMenu(); // Close the menu if it is active when the user scrolls
    }
  });
  
  const modal = document.getElementById("myModal");
  const closeBtn = document.querySelector(".close");
  //youtube elements
  const videoThumbnailElem = document.getElementById("videoThumbnail");
  const form = document.querySelector("form");
  const videoInfo = document.getElementById("videoInfo");
  const videoTitleElem = document.getElementById("videoTitle");
  const authorElem = document.getElementById("vidAuthor");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const formatsBtnsElm = document.getElementById("formatsBtns");
  //tiktok elements
  const tikVideoThumbnailElem = document.getElementById("tikVideoThumbnail");
  const tikVideoInfo = document.getElementById("tikInfo");
  const tikAuthorElem = document.getElementById("tikVidAuthor");
  const tikFormatsBtnsElm = document.getElementById("tikFormatsBtns");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const inputUrl = document.getElementById("urlInput").value;
    // Regular expressions to match YouTube and TikTok URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.*/i;
    const tiktokRegex = /^(https?:\/\/)?(www\.|vm\.)?tiktok\.com\/.*/i;
    const facebookRegex = /^(https?:\/\/)?(m\.)?(www\.)?facebook\.com\/.*/i;

    let urlType = "";
    if (youtubeRegex.test(inputUrl)) {
      urlType = "youtube";
    } else if (tiktokRegex.test(inputUrl)) {
      urlType = "tiktok";
    } else if (facebookRegex.test(inputUrl)) {
      urlType = "facebook";
    } else {
      toastTxt1.innerHTML = "Invalid Link";
      toastTxt2.innerHTML = "Please enter a supported link.";
      openToast();
      return;
    }

    try {
      loadingIndicator.style.display = "block"; // Show loading animation
      videoInfo.style.display = "none"; // Hide video info while loading
      videoTitleElem.innerHTML = "";
      formatsBtnsElm.innerHTML = "";
      authorElem.innerHTML = "";
      tikVideoInfo.style.display = "none"; // Hide video info while loading
      tikFormatsBtnsElm.innerHTML = "";
      tikAuthorElem.innerHTML = "";

      if (urlType === "youtube") {
        const response = await fetch(`/ytinfo?ytUrl=${inputUrl}`);
        if (!response.ok) {
          const responseData = await response.text();
      if (responseData.includes("Video unavailable")) {
        // Handle the case where the video is unavailable
        console.error("YouTube video is unavailable");
        throw new Error("YouTube video is unavailable");
      } else throw new Error(`Failed to fetch YouTube video info. Status: ${response.status}`);
      }
      
        const data = await response.json();

        if (data.videoDetails) {
          const { title, thumbnail, qualities, audio, author } =
            data.videoDetails;
          videoTitleElem.textContent = title;
          videoThumbnailElem.src = thumbnail;
          videoThumbnailElem.style.display = "block"; // Show video thumbnail
          videoInfo.style.display = "flex";

          qualities.forEach((format) => {
            const formatButton = document.createElement("button");

            formatButton.innerHTML = `${format.quality} - video/mp4 <br> <span style="color: black;">${format.fileSize}</span>`;
            formatButton.addEventListener("click", () => {
              window.open(`/download-yt?itag=${format.itag}&ytUrl=${inputUrl}`);
            });
            formatsBtnsElm.appendChild(formatButton); // Append the button to the container
          });

          audio.forEach((format) => {
            const formatButton = document.createElement("button");
            formatButton.innerHTML = `${format.bitrate}kbps - audio <br> <span style="color: black;">${format.fileSize}</span>`;
            formatButton.addEventListener("click", () => {
              window.open(`/download-yt?itag=${format.itag}&ytUrl=${inputUrl}`);
            });
            formatsBtnsElm.appendChild(formatButton); // Append the button to the container
          });
          authorElem.textContent = `Author: ${author.user}`;
          videoInfo.appendChild(authorElem);
          // Save video details to local storage for history feature
          const videoDetails = {
            title: title,
            url: inputUrl,
            thumbnail: thumbnail,
          };

          // Retrieve existing history or initialize an empty array
          let videoHistory =
            JSON.parse(localStorage.getItem("videoHistory")) || [];

          // Add current video details to the history
          videoHistory.unshift(videoDetails);

          // Limit the number of items in the history (optional)
          const maxHistoryItems = 10; // Set your desired limit
          videoHistory = videoHistory.slice(0, maxHistoryItems);

          // Save updated history to local storage
          localStorage.setItem("videoHistory", JSON.stringify(videoHistory));
        }
      } else if (urlType === "tiktok") {
        const response = await fetch(`/tikinfo?tikUrl=${inputUrl}`);
        const data = await response.json();

        if (data.title) {
          const { title, thumbnail, sd, hd, audio, author } = data;

          videoTitleElem.textContent = title;
          tikVideoThumbnailElem.src = thumbnail;
          tikVideoThumbnailElem.style.display = "block";
          tikVideoInfo.style.display = "block";

          if (sd) {
            const formatButtonSD = document.createElement("button");
            formatButtonSD.innerHTML = `Download SD <br> MP4`;
            formatButtonSD.addEventListener("click", () => {
              window.open(sd);
            });
            tikFormatsBtnsElm.appendChild(formatButtonSD);
          }

          if (hd) {
            const formatButtonHD = document.createElement("button");
            formatButtonHD.innerHTML = `Download HD <br> MP4
            `;
            formatButtonHD.addEventListener("click", () => {
              window.open(hd);
            });
            tikFormatsBtnsElm.appendChild(formatButtonHD);
          }

          if (audio) {
            const formatButtonAudio = document.createElement("button");
            formatButtonAudio.innerHTML = `Download MP3 <br> Audio`;
            formatButtonAudio.addEventListener("click", () => {
              window.open(audio);
              console.log("Audio link: ", audio);
            });
            tikFormatsBtnsElm.appendChild(formatButtonAudio);
          }

          // Display author information if available
          if (author) {
            tikAuthorElem.textContent = `Author: ${author}`;
            tikVideoInfo.appendChild(authorElem);
          }
        }
      } else if (urlType === "facebook") {
        try {
          const response = await fetch('http://127.0.0.1:5000/dl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Url: inputUrl,
              // Include other data if needed in the request body
            }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data) {
            const { title, thumbnail, formats } = data;
            videoTitleElem.textContent = title;
            tikVideoThumbnailElem.src = thumbnail;
            tikVideoThumbnailElem.style.display = "block";
            tikVideoInfo.style.display = "block";
      
            formats.forEach((format) => {
              const { ext, filesize, resolution, url } = format;
              const displayResolution = resolution.dimensions || resolution.format_id;
              const formatButton = document.createElement("button");
              formatButton.innerHTML = `${displayResolution} - ${ext} <br> <span style="color: black;">${filesize}</span>`;
              formatButton.addEventListener("click", () => {
                window.open(`${url}&dl=1`);
              });
              tikFormatsBtnsElm.appendChild(formatButton);
            });
          } else {
            throw new Error('No data received from the server');
          }
        } catch (error) {
          console.error('Error during fetch:', error.message);
          // display an error message to the user
          alert('An error occurred while fetching Facebook video info. Please try again later.');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Display an error message to the user
      toastTxt1.innerHTML = "ERROR";
      toastTxt2.innerHTML = `${error}`;
      openToast();
    } finally {
      loadingIndicator.style.display = "none"; // Hide loading animation
    }
  });

  // Close the pop-up when the close button is clicked
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
