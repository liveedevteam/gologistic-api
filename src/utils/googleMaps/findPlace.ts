import axios from "axios";

export default async (name: string) => {
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${process.env.GOOGLE_PLACE_API_KEY}`,
    headers: {},
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(`Find place`, error);
  }
};


