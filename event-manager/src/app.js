import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { fork } from "child_process";

import connectMongo from "./models/mongo/event/database.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

try {
  const redisProducerChild = fork(
    path.join(_dirname, "/child/redis-producer/eventRule.js")
  );
  redisProducerChild.on("message", (message) => {
    if (message.status === "success") {
      console.log("Event rules fetched successfully:", message.data);
    } else if (message.status === "error") {
      console.log("Error in child process:", message.message);
    }
  });
} catch (error) {
  console.log(error.message);
}

const app = express();

app.use(express.json());
app.use(cors());

export default app;
