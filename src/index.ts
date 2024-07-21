import express from "express";
import serverless from "serverless-http";
import server from "./server";

const app = express();

server(app);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err);
  process.exit(1);
});

export const handler = serverless(app);
