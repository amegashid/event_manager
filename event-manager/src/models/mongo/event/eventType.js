import mongoose from "mongoose";

const EventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const EventType = mongoose.model("Event-Type", EventTypeSchema);
async function saveEventType(eventTypeInput) {
  const name = eventTypeInput.name;
  const existingEventType = await EventType.findOne({ name });

  if (existingEventType) {
    throw new Error(`Event type "${existingEventType.name}" already exists`);
  }

  try {
    const newEventType = new EventType(eventTypeInput);
    return await newEventType.save();
  } catch (error) {
    throw new Error(`Error saving event type "${eventTypeInput.name}": ${error.message}`);
  }
}

async function getEventTypeById(_id) {
  if (!_id) {
    throw new Error("Invalid or missing '_id' parameter");
  }

  try {
    const eventType = await EventType.findById(_id);
    if (!eventType) {
      throw new Error(`Event type "${_id}" not found in fetch`);
    }
    return eventType;
  } catch (error) {
    throw new Error(`Error fetching event type "${_id}": ${error.message}`);
  }
}
async function updateEventType(_id, updates) {
  if (!_id) {
    throw new Error("Error updating event type: Invalid or missing '_id' parameter");
  }

  if (!updates || typeof updates !== "object") {
    throw new Error("Error updating event type: Invalid updates object");
  }

  updates.updatedAt = new Date();

  try {
    const updatedEventType = await EventType.findByIdAndUpdate(
      _id,
      { ...updates },
      { new: true }
    );

    if (!updatedEventType) {
      throw new Error(`Error updating event type: Event type "${_id}" not found in update`);
    }

    return updatedEventType;
  } catch (error) {
    throw new Error(`Error updating event type "${_id}": ${error.message}`);
  }
}
async function deleteEventType(_id) {
  if (!_id) {
    throw new Error("Error deleting event rule: Invalid or missing '_id' parameter");
  }

  try {
    const deletedEventType = await EventType.findByIdAndDelete(_id);

    if (!deletedEventType) {
      throw new Error(`Error deleting event rule: Event type "${_id}" not found in delete`);
    }

    return deletedEventType;
  } catch (error) {
    throw new Error(`Error deleting event rule "${_id}": ${error.message}`);
  }
}

export { saveEventType, getEventTypeById, updateEventType, deleteEventType };
