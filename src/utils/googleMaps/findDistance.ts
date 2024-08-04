import axios from "axios";

export default async (start: string, end: string) => {
  const apiKey = process.env.GOOGLE_PLACE_API_KEY;
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      start
    )}&destinations=${encodeURIComponent(end)}&key=${apiKey}`,
    headers: {},
  };
  try {
    const response = await axios(config);
    console.log(`Find distance`, response.data);
    return response.data;
  } catch (error) {
    console.log(`Find distance`, error);
    return error;
  }
};
