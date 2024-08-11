import mongoose from "mongoose";
import {
  saveEventType,
  getEventTypeById,
  updateEventType,
  deleteEventType,
} from "./eventType.js";

const EventSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "EventType",
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sourceType: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  acknowledged: {
    type: mongoose.Schema.Types.Mixed,
  },
  active: {
    type: mongoose.Schema.Types.Mixed,
  },
  inactive: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", EventSchema);

async function saveEvent(eventInput) {
  try {
    const newEvent = new Event(eventInput);
    return await newEvent.save();
  } catch (error) {
    throw new Error(
      `Error saving event "${eventInput.name}": ${error.message}`
    );
  }
}

async function getEventsById(_id) {
  if (!_id) {
    throw new Error("Error getting event: Invalid or missing '_id' parameter");
  }

  try {
    const event = await Event.findById(_id);
    if (!event) {
      throw new Error(`Error getting event: Event not found with id "${_id}" in fetch`);
    }

    return event;
  } catch (error) {
    throw new Error(`Error getting event with id "${_id}": ${error.message}`);
  }
}

async function updateEvent(_id, updatedEvent) {
  if (!_id) {
    throw new Error("Error updating event: Invalid or missing '_id' parameter");
  }

  if (!updatedEvent || typeof updatedEvent !== "object") {
    throw new Error("Error updating event: Invalid or missing 'updatedEvent' parameter");
  }

  updatedEvent.updateAt = Date.now();

  try {
    const updatedEventResult = await Event.findByIdAndUpdate(
      _id,
      { ...updatedEvent },
      { new: true }
    );

    if (!updatedEventResult) {
      throw new Error(`Error updating event: Event not found with id "${_id}" in update`);
    }

    return updatedEventResult;
  } catch (error) {
    throw new Error(`Error updating event "${_id}": ${error.message}`);
  }
}

async function deleteEvent(_id) {
  if (!_id) {
    throw new Error("Error deleting event: Error deleting event: Invalid or missing '_id' parameter");
  }
  try {
    const deletedEvent = await Event.findByIdAndDelete(_id);
    if (!deletedEvent) {
      throw new Error(`Error deleting event: Error deleting event: Event not found with id "${_id}" in delete`);
    }
    return deletedEvent;
  } catch (error) {
    throw new Error(`Error deleting event "${_id}": ${error.message}`);
  }
}

export { saveEvent, getEventsById, updateEvent, deleteEvent };
