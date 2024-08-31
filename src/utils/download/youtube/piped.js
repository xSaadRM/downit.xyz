export const getYTInfo = async (url) => {
  const pattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(pattern);

  if (!match || !match[1]) {
    throw new Error("Invalid YouTube URL");
  }

  const videoId = match[1];

  const response = await fetch(
    `https://pipedapi.kavin.rocks/streams/${videoId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube video information");
  }

  const data = await response.json();
  console.log(data)
  return data;
};
