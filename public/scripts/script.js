// Function to render video history in the history menu
const renderVideoHistory = () => {
  const historyMenu = document.querySelector(".history-menu ul");
  historyMenu.innerHTML = ""; // Clear previous history

  // Open IndexedDB
  const request = indexedDB.open("VideoHistoryDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["videoHistory"], "readonly");
    const objectStore = transaction.objectStore("videoHistory");

    const getVideoHistory = objectStore.getAll();

    getVideoHistory.onsuccess = function (event) {
      // Retrieve video history from IndexedDB
      const videoHistory = event.target.result || [];

      // Iterate through video history and create list items with thumbnails and titles
      videoHistory.forEach((video, index) => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");
        const thumbnailImg = document.createElement("img");

        // Set thumbnail source and alt text
        thumbnailImg.src = video.thumbnail;
        thumbnailImg.alt = "Thumbnail";

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

    getVideoHistory.onerror = function (event) {
      console.error(
        "Error getting video history from IndexedDB",
        event.target.error
      );
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB", event.target.error);
  };
};
