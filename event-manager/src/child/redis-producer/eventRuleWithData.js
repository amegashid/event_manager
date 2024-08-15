import redisClient from "../../models/redis/database.js";
import connectMongo from "../../models/mongo/event/database.js";
import { getAllEventsRule } from "../../models/mongo/event/eventRule.js";
import { fetchDataById } from "../../models/mongo/data/data.js";

// Connect to databases
try {
  await redisClient.connect();
  console.log("Redis producer connected to Redis to send event rules");

  await connectMongo();
  console.log("Redis producer connected to MongoDB to read events rules");
} catch (error) {
  console.log(error.message);
}

process.on("message", (message) => {
  if (message === "start") {
    main();
  } else {
    console.error("Unknown message:", message);
  }
});

async function main() {
  try {
    const eventRules = await getAllEventsRuleFromMongo();
    const sendResult = await sendEventRuleToRedis(eventRules);
    process.send({
      status: "success",
      message: `Result of sending event rules with data value on redis: ${sendResult}`,
    });
  } catch (error) {
    process.send({ status: "error", message: error.message });
  }
}

async function getAllEventsRuleFromMongo() {
  try {
    const eventRules = await getAllEventsRule();
    return eventRules;
  } catch (error) {
    throw new Error(error);
  }
}
async function sendEventRuleToRedis(eventRules) {
  try {
    const result = [];

    for (let eventRule of eventRules) {
      const plainEventRule = eventRule.toObject(); // To avoid storing additional information related to Mongo cache
      const id = eventRule.source;

      try {
        const data = await fetchDataById(id);
        if (data) {
          const { value } = data;
          const status = 'inactive';

          // Create key and fields to send to Redis
          const fields = {
            ...plainEventRule,
            value: value.toString(),
            status: status,
          };   

          result.push(fields);
        }
      } catch (error) {
        console.log(`Error fetching data: ${error.message}`);
      }
    }
    const sendResult = await redisClient.set('dataWithEventRule', JSON.stringify(result));
    return sendResult;
  } catch (error) {
    console.error("Error in send event rule to redis:", error.message);
    throw new Error(error);
  }
}
