import mongoose from "mongoose";
import faker from "faker";
import { saveEventRule } from "../../models/mongo/event/eventRule.js";

const numberOfRules = 10;

function generateRandomDetails() {
  const types = ["temperature", "humidity", "voltage"];
  const randomType = faker.random.arrayElement(types);

  switch (randomType) {
    case "temperature":
      return {
        min: faker.datatype.number({ min: -30, max: 0 }),
        max: faker.datatype.number({ min: 1, max: 50 })
      };
    case "boolean":
      return faker.datatype.boolean();
    case "string":
      return faker.lorem.sentence();
    default:
      return null;
  }
}

async function createRandomEventRules() {
  for (let i = 0; i < numberOfRules; i++) {
    const eventRule = {
      name: faker.lorem.word(),
      source: new mongoose.Types.ObjectId(), 
      sourceType: faker.random.arrayElement(["sensor", "device", "system"]),
      details: generateRandomDetails()
    };

    try {
      const savedRule = await saveEventRule(eventRule);
      console.log(`Event rule created: ${savedRule._id}`);
    } catch (error) {
      console.error(`Error creating event rule: ${error.message}`);
    }
  }
}

mongoose.connect("mongodb://localhost:27017/test_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  createRandomEventRules().then(() => {
    console.log("Random event rules creation completed");
    mongoose.disconnect();
  });
}).catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});
