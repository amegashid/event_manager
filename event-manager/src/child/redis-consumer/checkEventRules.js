import mongoose from 'mongoose';
import chalk from 'chalk';
import connectMongo from '../../models/mongo/event/database.js';

import redisClient from "../../models/redis/database.js";
import { saveEvent } from "../../models/mongo/event/event.js";
import { getEventTypeById } from "../../models/mongo/event/eventType.js";

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
    const checkConditionInterval = setInterval(main, 1000);
  } else {
    console.error("Unknown message(check-event-rules child):", message);
  }
});

async function main() {
  try {
    let data = await fetchEventRulesFromRedis();
    data = JSON.parse(data);
    data.forEach(async (item) => {
      const isActiveEvent = await checkConditions(item); // isActiveEvent==true ---> store event to mongo
      if (isActiveEvent) {
        try {
        const eventObject = {
          type: new mongoose.Types.ObjectId('66b8a19d7d487204e37c3b78'), // *****************
          source: item.source,
          sourceType: item.sourceType,
          message:'dddd',
          value: item.value,
          status: 'active'
        }
        await saveEvent(eventObject)
        } catch (error) {
          throw new Error("Error sending event to mongo(check-event-rules child):" + error)
        }
      }
    })

    await updateDataOnRedis(data)
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

async function checkConditions(item) {
  const { details: threshold, value, status } = item;
  const { min, max } = threshold;

  // console.log(`Before: ${item._id}, status: ${status}, value: ${value}`);

  if (status === 'active') {
    if (value > min && value < max) {
      console.log(stable(`The status of ${item._id} is back to normal`));
      item.status = 'inactive';
      return false
    }
  } else if (status === "inactive") {
    if (value < min) {
      console.log(alarm(`Alarm: The temperature sent by ${item._id} is low`));
      item.status = 'active';
      return true; // Should it be stored in Mongo?
    } else if (value > max) {
      console.log(alarm(`Alarm: The temperature sent by ${item._id} is high`));
      item.status = 'active';
      return true; // Should it be stored in Mongo?
    }
  }

  // console.log(`After: ${item._id}, status: ${item.status}, value: ${value}`);
}

async function updateDataOnRedis(data) {
  try {
    const convertedData = JSON.stringify(data)
    const key = 'dataWithEventRule'

    await redisClient.set(key, convertedData);
  } catch (error) {
    throw new Error('Error sending updated data to Redis(check-event-rules child)')
  }
}
