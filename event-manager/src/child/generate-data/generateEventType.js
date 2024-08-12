import mongoose from "mongoose";
import faker from "faker";
import { saveEventType } from "../../models/mongo/event/eventType.js";

const numberOfEventTypes = 10;

function generateRandomEventType() {
  return {
    name: faker.lorem.word(),
    details: faker.random.arrayElement([
      { min: faker.datatype.number({ min: 1, max: 10 }), max: faker.datatype.number({ min: 11, max: 100 }) },
      faker.datatype.boolean(),
      faker.lorem.sentence()
    ])
  };
}

async function createRandomEventTypes() {
  for (let i = 0; i < numberOfEventTypes; i++) {
    const eventType = generateRandomEventType();

    try {
      const savedEventType = await saveEventType(eventType);
      console.log(`Event type created: ${savedEventType._id}`);
    } catch (error) {
      console.error(`Error creating event type: ${error.message}`);
    }
  }
}

mongoose.connect("mongodb://localhost:27017/test_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  createRandomEventTypes().then(() => {
    console.log("Random event types creation completed");
    mongoose.disconnect();
  });
}).catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});
