document.addEventListener("DOMContentLoaded", () => {
  const mobileNavBar = document.getElementById("mobile-navbar");
  const bartgl = document.getElementById("barToggle");
  const navBarCloser = document.getElementById("navBarCloser");
  const toastTxt1 = document.getElementById("toast-txt1");
  const toastTxt2 = document.getElementById("toast-txt2");
  const toast = document.querySelector(".toast");
  const closeIcon = document.querySelector(".close");
  const progress = document.querySelector(".progress");
  const overlay = document.querySelector(".overlay");
  let toastTimer1, toastTimer2;
  //NavBar
  bartgl.addEventListener("click", () => {
    mobileNavBar.classList.toggle("active");
    navBarCloser.classList.remove("hide");
  });
  navBarCloser.addEventListener("click", () => {
    mobileNavBar.classList.remove("active");
    navBarCloser.classList.add("hide");
  });

  const openToast = () => {
    overlay.style.display = "block";
    toast.classList.add("active");
    progress.classList.add("active");

    toastTimer1 = setTimeout(() => {
      toast.classList.remove("active");
      overlay.style.display = "none";
    }, 5000);

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

  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  const toggleDarkMode = () => {
    body.classList.toggle("dark-mode");
    const isDarkModeEnabled = body.classList.contains("dark-mode");
    localStorage.setItem("darkModePreference", isDarkModeEnabled);
  };

  const savedDarkModePreference = localStorage.getItem("darkModePreference");
  const hasVisitedBefore = localStorage.getItem("firstTimeVisit");
  if (savedDarkModePreference === "true") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  } else if (!hasVisitedBefore){
    toastTxt1.innerHTML = "huh Light Theme?";
    toastTxt2.innerHTML = "Please turn on dark-mode from the website for your mental health 🙏🏿";
    openToast();
    localStorage.setItem("firstTimeVisit", false);
  }

  darkModeToggle.addEventListener("click", toggleDarkMode);

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

  window.addEventListener("scroll", () => {
    if (leftMenu.classList.contains("active")) {
      closeMenu();
    }
  });
  const thumbnailContainer = document.querySelector(".thumbnail-container");
  const videoThumbnailElem = document.getElementById("videoThumbnail");
  const form = document.querySelector("form");
  const videoInfo = document.getElementById("videoInfo");
  const videoTitleElem = document.getElementById("videoTitle");
  const authorElem = document.getElementById("vidAuthor");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const formatsBtnsElm = document.getElementById("formatsBtns");

  form.addEventListener("submit", handleFormSubmission);

  async function handleFormSubmission(event) {
    event.preventDefault();
    const inputUrl = document.getElementById("urlInput").value;

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.*/i;
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
      overlay.style.display = "block";
      loadingIndicator.style.display = "block";
      videoInfo.style.display = "none";
      videoTitleElem.innerHTML = "";
      formatsBtnsElm.innerHTML = "";
      authorElem.innerHTML = "";

      if (urlType === "youtube") {
        await handleYouTubeVideo(inputUrl);
      } else if (urlType === "tiktok") {
        await handleTikTokVideo(inputUrl);
      } else if (urlType === "facebook") {
        await handleFacebookVideo(inputUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      toastTxt1.innerHTML = urlType;
      toastTxt2.innerHTML = `${error.message || error}`;
      openToast();
    } finally {
      loadingIndicator.style.display = "none";
      if (toast.classList.contains("active")) {
        overlay.style.display = "block";
      } else {
        overlay.style.display = "none";
      }
    }
  }

  async function handleYouTubeVideo(inputUrl) {
    const response = await fetch(`/ytinfo?ytUrl=${inputUrl}`);
    if (!response.ok) {
      const responseData = await response.text();
      if (responseData.includes("Video unavailable")) {
        throw new Error("YouTube video is unavailable");
      } else {
        throw new Error(
          `Failed to fetch YouTube video info. Status: ${response.status}`
        );
      }
    }

    const data = await response.json();

    if (data.videoDetails) {
      const { title, thumbnail, qualities, audio, author } = data.videoDetails;
      videoTitleElem.textContent = title;
      videoThumbnailElem.src = thumbnail;
      videoThumbnailElem.style.display = "flex";
      videoInfo.style.display = "flex";
      handleThumbnailAspectRatio(data.videoDetails.thumbnail);

      createFormatButtons(qualities, "video/mp4", qualities.url);
      createFormatButtons(audio, "audio", audio.url);

      authorElem.textContent = `Author: ${author.user}`;
      videoInfo.appendChild(authorElem);

      const videoDetails = {
        title: title,
        url: inputUrl,
        thumbnail: thumbnail,
      };

      updateVideoHistory(videoDetails);
    }
  }

  async function handleTikTokVideo(inputUrl) {
    const response = await fetch(`/tikinfo?tikUrl=${inputUrl}`);
    if (!response.ok) {
      const responseData = await response.text();
      if (responseData.includes("Video unavailable")) {
        throw new Error(`TikTok video is unavailable`);
      } else {
        throw new Error(
          `Failed to fetch TikTok video info. Status: ${response.status}`
        );
      }
    }

    const data = await response.json();

    if (data) {
      const { title, thumbnail, sd, hd, audio, author } = data;
      videoTitleElem.textContent = title;
      videoThumbnailElem.src = thumbnail;
      videoThumbnailElem.style.display = "flex";
      videoInfo.style.display = "flex";
      handleThumbnailAspectRatio(data.thumbnail);

      if (sd) {
        createDownloadButton("Download SD<br>720p", sd, "mp4", "720p");
      }

      if (hd) {
        createDownloadButton("Download HD<br>1080p", hd, "mp4", "1080p");
      }

      if (audio) {
        createDownloadButton("Download MP3<br>audio", audio, "mp3", "audio");
      }

      if (author) {
        authorElem.textContent = `Author: ${author}`;
        videoInfo.appendChild(authorElem);
      }
      const videoDetails = {
        title: title,
        url: inputUrl,
        thumbnail: thumbnail,
      };
      updateVideoHistory(videoDetails);
    }
  }

  async function handleFacebookVideo(inputUrl) {
      const response = await fetch(`/fbinfo?fbUrl=${inputUrl}`);
      if (!response.ok) {
        const responseData = await response.text();
        if (responseData.includes("Video unavailable")) {
          throw new Error("YouTube video is unavailable");
        } else {
          throw new Error(
            `Failed to fetch YouTube video info. Status: ${response.status}`
          );
        }
      }
      const data = await response.json();
      if (data) {
        const { title, thumbnail, sd, hd, audio, author } = data;
        videoTitleElem.textContent = title;
        videoThumbnailElem.src = thumbnail;
        videoThumbnailElem.style.display = "flex";
        videoInfo.style.display = "flex";
        handleThumbnailAspectRatio(data.thumbnail);

        if (sd) {
          createDownloadButton("Download SD", sd, "mp4", "sd");
        }

        if (hd) {
          createDownloadButton("Download HD", hd, "mp4", "hd");
        }

        if (audio) {
          createDownloadButton("Download MP3", audio, "mp3", "audio");
        }

        if (author) {
          authorElem.textContent = `Author: ${author}`;
          videoInfo.appendChild(authorElem);
        }

        const videoDetails = {
          title: title,
          url: inputUrl,
          thumbnail: thumbnail,
        };

        updateVideoHistory(videoDetails);
      } else {
        throw new Error("No data received from the server");
      }
  }

  function createFormatButtons(formats, type, url) {
    formats.forEach((format) => {
      const formatButton = document.createElement("button");
      formatButton.innerHTML = `${
        format.quality || format.bitrate
      } - ${type} <br> <span>${format.fileSize}</span>`;
      formatButton.addEventListener("click", () => {
        console.log(url);
        console.log(format.url);
        window.open(format.url);
      });
      formatsBtnsElm.appendChild(formatButton);
    });
  }

  function createDownloadButton(label, url) {
    const formatButton = document.createElement("button");
    formatButton.innerHTML = `${label}`;
    formatButton.addEventListener("click", () => {
      window.open(`/vdl/${url}`)
    });
    formatsBtnsElm.appendChild(formatButton);
  }

  function updateVideoHistory(videoDetails) {
    let videoHistory = JSON.parse(localStorage.getItem("videoHistory")) || [];
    videoHistory.unshift(videoDetails);
    const maxHistoryItems = 10;
    videoHistory = videoHistory.slice(0, maxHistoryItems);
    localStorage.setItem("videoHistory", JSON.stringify(videoHistory));
  }
  async function handleThumbnailAspectRatio(thumbnailUrl) {
    // Create a new Image element
    const thumbnailImage = new Image();

    // Set the source URL of the image
    thumbnailImage.src = thumbnailUrl;

    // Wait for the image to load
    await new Promise((resolve) => {
      thumbnailImage.onload = resolve;
    });

    // Check the aspect ratio after the image has loaded
    const aspectRatio = thumbnailImage.width / thumbnailImage.height;

    console.log("Aspect Ratio:", aspectRatio);

    if (aspectRatio > 1.5) {
      thumbnailContainer.classList.remove("isTikTokOrReelOrShort");
      thumbnailContainer.classList.add("isVideo");
    } else {
      thumbnailContainer.classList.remove("isVideo");
      thumbnailContainer.classList.add("isTikTokOrReelOrShort");
    }
  }
});
