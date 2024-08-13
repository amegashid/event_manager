import redisClient from "../../models/redis/database.js";
import connectMongo from "../../models/mongo/event/database.js";
import { getAllEventsRule } from "../../models/mongo/event/eventRule.js";
import { fetchDataById } from "../../models/mongo/data/data.js";


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
    const eventRules = await getAllEventsRuleAndSendParent();
    const result = [];

    for (let eventRule of eventRules) {
      const plainEventRule = eventRule.toObject(); // To avoid storing additional information related to Mongo cache
      const id = eventRule.source;
      try {
        const data = await fetchDataById(id);
        if (data) {
          const { value } = data;
          const newEventRule = {
            ...plainEventRule,
            value
          }
          result.push(newEventRule);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const sendResult = await sendEventRuleToRedis(result);

    process.send({
      status: "success",
      message: `Result of sending event rules with data value on redis: ${sendResult}`,
    });
  } catch (error) {
    process.send({ status: "error", message: error.message });
  }
}


async function getAllEventsRuleAndSendParent() {
  try {
    const eventRules = await getAllEventsRule();
    return eventRules;
  } catch (error) {
    throw new Error(error);
  }
}

async function sendEventRuleToRedis(eventRule) {
  try {
    return await redisClient.set("eventRuleWithData", JSON.stringify(eventRule));
  } catch (error) {
    throw new Error(error);
  }
}
