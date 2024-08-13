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
  // const redisProducerChild = fork(
  //   path.join(_dirname, "/child/redis-producer/eventRuleWithData.js")
  // );

  // redisProducerChild.send('start');
  // redisProducerChild.on("message", (message) => {
  //   if (message.status === "success") {
  //     console.log("Event rules fetched from mongo successfully,", message.message);
  //   } else if (message.status === "error") {
  //     console.log("Error in child process(redis-producer):", message.message);
  //   }
  // });

  /* ****************** */
  
  
  const redisConsumerChild = fork(path.join(_dirname, "/child/redis-consumer/checkEventRules.js"))
  redisConsumerChild.send('start');


  redisConsumerChild.on("message", (message) => {
    if (message.status === "success") {
      console.log("Event rules fetched from redis successfully,", message.message);
    } else if (message.status === "error") {
      console.log("Error in child process(redis-consumer):", message.message);
    }
  });
} catch (error) {
  console.log(error.message);
}

const app = express();

app.use(express.json());
app.use(cors());

export default app;
