import mongoose from "mongoose";
import chalk from "chalk";
import connectMongo from "../../models/mongo/event/database.js";

import redisClient from "../../models/redis/database.js";
import { updateEvent, saveEvent } from "../../models/mongo/event/event.js";

const alarm = chalk.bold.red;
const stable = chalk.bold.green;

// Connect to databases
try {
  await redisClient.connect();
  console.log("Redis consumer connected to Redis...");

  await connectMongo();
  console.log("Redis consumer connected to MongoDB to send event");
} catch (error) {
  console.log(error.message);
}

process.on("message", (message) => {
  if (message === "start") {
    setInterval(main, 1000);
  } else {
    console.error("Unknown message(check-event-rules child):", message);
  }
});

async function main() {
  try {
    let data = await fetchEventRulesFromRedis();
    data = JSON.parse(data);
    data.forEach(async (item) => {
      try {
        await checkConditions(item);
      } catch (error) {
        console.log('Error in check conditions:', error);
      }
    });
    await updateDataOnRedis(data);
  } catch (error) {
    process.send({ status: "error", message: error.message });
  }
}

async function fetchEventRulesFromRedis() {
  try {
    const data = await redisClient.get("dataWithEventRule");
    if (!data) {
      throw new Error("Data that fetched from redis is empty");
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateDataOnRedis(data) {
  try {
    const convertedData = JSON.stringify(data);
    const key = "dataWithEventRule";

    await redisClient.set(key, convertedData);
  } catch (error) {
    throw new Error(
      "Error sending updated data to Redis(check-event-rules child)"
    );
  }
}

async function checkConditions(item) {
  const { min, max } = item.details;

  if (item.status === "active") {
    if (item.value < min || item.value > max) {
      console.log(stable(`The status of ${item._id} is back to normal`));
      item.status = "inactive";

      try {
        const updatedFields = {
          status: "inactive",
          value: item.value,
          inactive: { timestamp: new Date(), value: item.value},
        };
        await updateEvent(item._id, item.source, "active", updatedFields);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } else if (item.status === "inactive") {
    if (item.value > min && item.value < max) {
      console.log(alarm(`Alarm: The temperature sent by ${item._id}`));
      item.status = "active";

      try {
        const newEvent = {
          type: new mongoose.Types.ObjectId("66b8a19d7d487204e37c3b78"),
          eventRule: item._id,
          source: item.source,
          sourceType: item.sourceType,
          message: "Alarm",
          value: item.value,
          active: { timestamp: new Date(), value: item.value },
          status: "active",
        };

        await saveEvent(newEvent);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}
