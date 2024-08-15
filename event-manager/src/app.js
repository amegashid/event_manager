import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { fork } from "child_process";


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

try {
  // Merge data with event rule
  const redisProducer = fork(
    path.join(_dirname, "/child/redis-producer/eventRuleWithData.js")
  );

  redisProducer.send('start');
  redisProducer.on("message", (message) => {
    if (message.status === "success") {
      console.log("Event rules fetched from mongo successfully,", message.message);
    } else if (message.status === "error") {
      console.log("Error in child process(redis-producer):", message.message);
    }
  });

  /* ****************** */
  
  
  const checkDataOnRedis = fork(path.join(_dirname, "/child/redis-consumer/checkEventRules.js"))
  checkDataOnRedis.send('start');
  
  checkDataOnRedis.on("message", (message) => {
    if (message.status === "success") {
      console.log("Event rules fetched from redis successfully,", message.message);
    } else if (message.status === "error") {
      console.log("Error in child process(redis-consumer):", message.message);
    }
  });

  /* ******************* */

  // const changeDataOnRedis = fork(path.join(_dirname, "/child/generate-data/changeData.js"))
  // changeDataOnRedis.send('start');


  // changeDataOnRedis.on("message", (message) => {
  //   if (message.status === "success") {
  //     console.log(message.message);
  //   } else if (message.status === "error") {
  //     console.log("Error in child process(change-data):", message.message);
  //   }
  // });

} catch (error) {
  console.log(error.message);
}

const app = express();

app.use(express.json());
app.use(cors());

export default app;
