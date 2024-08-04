import { Request, Response } from "express";
import axios from "axios";

export default async (userLineIds: any, messages: any) => {
  const { LINE_CHANNEL_TOKEN: channelToken } = process.env;
  const url = "https://api.line.me/v2/bot/message/push";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${channelToken}`,
  };
  const data = {
    to: userLineIds,
    messages,
  };

  try {
    await axios.post(url, data, { headers });
    console.log("Push message success");
    return;
  } catch (error: any) {
    console.error("Push message error", error.message);
    console.error(error.response.data);
    return;
  }
};
