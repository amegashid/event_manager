import mongoose from "mongoose";
import {
  saveEventType,
  getEventTypeById,
  updateEventType,
  deleteEventType,
} from "./eventTypes.js";

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
    type: Object,
  },
  active: {
    type: Object,
  },
  inactive: {
    type: Object,
  },
  status: {
    type: String,
    required: true,
  },
});
EventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
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
    throw new Error("Invalid or missing '_id' parameter");
  }

  try {
    const event = await Event.findById(_id);
    if (!event) {
      throw new Error(`Event not found with id "${_id}" in fetch`);
    }

    return event;
  } catch (error) {
    throw new Error(`Error getting event with id "${_id}": ${error.message}`);
  }
}

async function updateEvent(_id, updatedEvent) {
  if (!_id) {
    throw new Error("Invalid or missing '_id' parameter");
  }

  if (!updatedEvent || typeof updatedEvent !== "object") {
    throw new Error("Invalid or missing 'updatedEvent' parameter");
  }

  updatedEvent.updateAt = Date.now();

  try {
    const updatedEventResult = await Event.findByIdAndUpdate(
      _id,
      { ...updatedEvent },
      { new: true }
    );

    if (!updatedEventResult) {
      throw new Error(`Event not found with id "${_id}" in update`);
    }

    return updatedEventResult;
  } catch (error) {
    throw new Error(`Error updating event "${_id}": ${error.message}`);
  }
}

async function deleteEvent(_id) {
  if (!_id) {
    throw new Error("Invalid or missing '_id' parameter");
  }
  try {
    const deletedEvent = await Event.findByIdAndDelete(_id);
    if (!deletedEvent) {
      throw new Error(`Event not found with id "${_id}" in delete`);
    }
    return deletedEvent;
  } catch (error) {
    throw new Error(`Error deleting event "${_id}": ${error.message}`);
  }
}

export { saveEvent, getEventsById, updateEvent, deleteEvent };

try {
  // const eventType = {
  //     name: 'Warning',
  //     details: {
  //         message: 'This is a warning event',
  //         color: 'yellow',
  //         backgroundColor: 'blue',
  //     }
  // }
  // const newEventType = await saveEventType(eventType);

  // const event = {
  //     dataId: '5f98499034064d1452854b5b',
  //     eventTypeId: newEventType._id,
  //     name: 'Sample event',
  // }
  // const newEvent = await saveEvent(event);
  // const event = await getEventsById("66b7561a9e8d650b8a2df8a8");
  const updatedEventObject = {
    status: "deactive",
    endTime: new Date(),
    viewedAt: new Date(),
  };
  const event = await updateEvent(
    "66b7561a9e8d650b8a2df8a8",
    updatedEventObject
  );
  console.log(event);
} catch (error) {
  console.log(error);
}
