import axios from "axios";

export async function fetchImage(location) {
  const key = process.env.UNSPLASH_KEY;
  if (!key) throw new Error("UNSPLASH_KEY env var missing");

  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
    location
  )}&orientation=landscape&content_filter=high&client_id=${key}`;

  const { data } = await axios.get(url);
  const imageUrl = data.urls.regular;

  return imageUrl;
}
