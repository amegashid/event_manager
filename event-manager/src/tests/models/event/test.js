import mongoose from "mongoose";
import { expect } from "chai";
import * as eventRuleModel from "../../../models/mongo/event/eventRule.js";
import * as eventTypeModel from "../../../models/mongo/event/eventType.js";
import * as eventModel from "../../../models/mongo/event/event.js";

const dbUrl = "mongodb://localhost:27017/test_db";

describe("Event, EventType, and EventRule Schema Tests", function() {
  before(async function () {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  let eventTypeId, eventId, eventRuleId;

  it("should save an event type", async function () {
    const eventTypeInput = { name: "Test EventType", details: { description: "Sample event type" } };
    const savedEventType = await eventTypeModel.saveEventType(eventTypeInput);
    eventTypeId = savedEventType._id;
    expect(savedEventType.name).to.equal("Test EventType");
  });

  it("should throw an error when saving a duplicate event type", async function () {
    const eventTypeInput = { name: "Test EventType", details: { description: "Sample event type" } };
    try {
      await eventTypeModel.saveEventType(eventTypeInput);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.equal(`Event type "Test EventType" already exists`);
    }
  });

  it("should save an event", async function () {
    const eventInput = {
      type: eventTypeId,
      source: new mongoose.Types.ObjectId(),
      sourceType: "number",
      message: "Test message",
      value: "100",
      status: "active",
    };
    const savedEvent = await eventModel.saveEvent(eventInput);
    eventId = savedEvent._id;
    expect(savedEvent.message).to.equal("Test message");
  });

  it("should throw an error when saving an event with missing parameters", async function () {
    // Don't send an event with all properties
    const invalidEventInput = { source: new mongoose.Types.ObjectId(), sourceType: "number" };
    try {
      await eventModel.saveEvent(invalidEventInput);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Event validation failed");
    }
  });

  it("should save an event rule", async function () {
    const eventRuleInput = {
      name: "Test EventRule",
      source: new mongoose.Types.ObjectId(),
      sourceType: "number",
      details: { rule: "Sample rule" },
    };
    const savedEventRule = await eventRuleModel.saveEventRule(eventRuleInput);
    eventRuleId = savedEventRule._id;
    expect(savedEventRule.name).to.equal("Test EventRule");
  });

  it("should throw an error when saving an event rule with missing parameters", async function () {
    const invalidEventRuleInput = { name: "Test EventRule", source: new mongoose.Types.ObjectId() };
    try {
      await eventRuleModel.saveEventRule(invalidEventRuleInput);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error saving event rule");
    }
  });

  it("should get an event by ID", async function () {
    const fetchedEvent = await eventModel.getEventsById(eventId);
    expect(fetchedEvent.message).to.equal("Test message");
  });

  it("should throw an error when getting an event with an invalid ID", async function () {
    try {
      await eventModel.getEventsById("invalid_id");
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error getting event");
    }
  });

  it("should update an event", async function () {
    const updatedEvent = await eventModel.updateEvent(eventId, { message: "Updated message" });
    expect(updatedEvent.message).to.equal("Updated message");
  });

  it("should throw an error when updating an event with invalid parameters", async function () {
    try {
      await eventModel.updateEvent(eventId, null);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error updating event");
    }
  });

  it("should delete an event", async function () {
    const deletedEvent = await eventModel.deleteEvent(eventId);
    expect(deletedEvent._id.toString()).to.equal(eventId.toString());
  });

  it("should throw an error when deleting an event with an invalid ID", async function () {
    try {
      await eventModel.deleteEvent("invalid_id");
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error deleting event");
    }
  });

  /* Additional tests for EventType and EventRule:
        Here is the error control in general, 
        we can write a separate test for each error uniquely
        by changing the text inside the include function.
  */ 
  it("should throw an error when updating an event type with invalid parameters", async function () {
    try {
      await eventTypeModel.updateEventType(eventTypeId, null);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error updating event type");
    }
  });

  it("should throw an error when deleting an event type with an invalid ID", async function () {
    try {
      await eventTypeModel.deleteEventType("invalid_id");
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error deleting event rule");
    }
  });

  it("should throw an error when updating an event rule with invalid parameters", async function () {
    try {
      await eventRuleModel.updateEventRule(eventRuleId, null);
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Invalid updates object");
    }
  });

  it("should throw an error when deleting an event rule with an invalid ID", async function () {
    try {
      await eventRuleModel.deleteEventRule("invalid_id");
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      expect(error.message).to.include("Error deleting event rule");
    }
  });
});
