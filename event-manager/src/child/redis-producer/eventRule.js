import redisClient from "../../models/redis/database.js";
import { getAllEventsRule } from "../../models/mongo/event/eventRule.js";
import connectMongo from "../../models/mongo/event/database.js";

process.on("message", (message) => {
  if (message === "start") {
    main();
  } else {
    console.error("Unknown message:", message);
  }
});

async function main() {
  try {
    const eventRules = await getAllEventsRuleAndSendParent();
    const result = await sendEventRuleToRedis(eventRules);

    process.send({status: 'success', message: `Result of sending event rules on redis: ${result}`})
  } catch (error) {
    process.send({ status: "error", message: error });
  }
}
async function getAllEventsRuleAndSendParent() {
  try {
    await connectMongo();
    console.log("Redis producer connected to MongoDB to read events rules");

    const eventRules = await getAllEventsRule();
    return eventRules;
  } catch (error) {
    throw new Error(error);
  }
}

async function sendEventRuleToRedis(eventRule) {
  try {
    await redisClient.connect();
    console.log("Redis producer connected to Redis to send event rules");

    return await redisClient.set(
      "eventRule",
      JSON.stringify(eventRule)
    );
  } catch (error) {
    throw new Error(error);
  } finally {
    redisClient.quit();
    console.log("Redis producer disconnected from Redis");
  }
}
