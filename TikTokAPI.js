const tiktokDl = require("@sasmeee/tkdl");
const url = "https://vm.tiktok.com/ZM6ANPDDA/";

async function fetchData() {
  try {
    const dataList = await tiktokDl(url);

    if (Array.isArray(dataList) && dataList.length > 0) {
      const firstItem = dataList[0];
      if (firstItem && firstItem.title) {
        console.log(firstItem.title); // Log the 'title' property of the first object in the array
      } else {
        console.log("Title not found in the fetched data.");
      }
    } else {
      console.log("Empty or invalid data received.");
    }
    // You can continue working with 'dataList' here
  } catch (error) {
    console.error("Error occurred:", error);
    // Handle errors here
  }
}

// Call the async function
fetchData();
