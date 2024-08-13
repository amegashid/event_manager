import redisClient from "../../models/redis/database.js";

// Connect to database
try {
  await redisClient.connect();
  console.log("Redis producer connected to Redis to send event rules");
} catch (error) {
  console.log(`Error connecting redis consumer to Redis: ${error}`);
}

process.on("message", (message) => {
  if (message === "start") {
    const checkConditionInterval = setInterval(main, 1000)
    main();
  } else {
    console.error("Unknown message:", message);
  }
});

async function main() {
  try {
    let data = await fetchEventRulesFromRedis();
    data = JSON.parse(data);

    for (let item of data) {
      const {details: threshold, sourceType, value} = item;
      if (false) {
        // condition of source type
      }
      const { min, max } = threshold;
      if (value < min) {
        console.log(`Alarm: The temperature sent by ${item._id} is low`);
      } else if (value > max) {
        console.log(`Alarm: The temperature sent by ${item._id} is high`);
      }
    }
  } catch (error) {
    process.send({ status: "error", message: error });
  }
}

async function fetchEventRulesFromRedis() {
  try {
    return await redisClient.get("eventRuleWithData");
  } catch (error) {
    throw new Error(error);
  }
}
