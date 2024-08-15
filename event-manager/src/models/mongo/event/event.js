import mongoose from "mongoose";
import chalk from "chalk";

const exist = chalk.bold.yellow;

const EventSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event-Type",
  },
  eventRule: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event-Rule"
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
  active: {
    type: mongoose.Schema.Types.Mixed,
  },
  inactive: {
    type: mongoose.Schema.Types.Mixed,
  },
  acknowledged: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    required: true,
  },
  createsAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model("Event", EventSchema);

async function saveEvent(eventInput) {
  try {
    /*
    It does not allow the creation of two events
    with the same active status for the same event 
    rule and source
    */
    const eventRule = eventInput.eventRule;
    const source = eventInput.source;
    const status = 'active';

    const existingEvent = await Event.findOne({
      eventRule,
      source,
      status,
    });

    if (existingEvent) {
      const updatedFields = {
        ...eventInput
      }
      const updatedEvent = await updateEvent(eventRule, source, status, updatedFields)
      console.log(exist(`An event with active status for the same event rule ${eventRule} and source ${source} already exists, so it was replaced`));
      return updatedEvent;
    }

    const newEvent = new Event(eventInput);
    return await newEvent.save();    
  } catch (error) {
    throw new Error(
      `Error saving event: ${error.message}`
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

async function getEventBySource(source) {
  if (!source) {
    throw new Error("Error getting event: Invalid or missing 'source' parameter");
  }

  try {
    const event = await Event.findOne({ source });
    if (!event) {
      throw new Error(`Error getting event: Event not found with source "${source}" in fetching`);
    }

    return event;
  } catch (error) {
    throw new Error(`Error getting event with id "${source}": ${error.message}`);
  }
}

async function updateEvent(eventRule, source, status, updatedFields) {
  try {   
    const result =  await Event.findOneAndUpdate(
        { eventRule, source, status },
        { $set: updatedFields },
        { new: true }
      );

      if (!result) {
        const newEvent = {
          type: new mongoose.Types.ObjectId("66b8a19d7d487204e37c3b78"),
          eventRule,
          source,
          message: "Alarm",
          value: updatedFields.value,
          inactive: updatedFields.value,
          status: "inactive",
        }
        throw new Error(`Error updating event: Event not found with source "${source}" and event rule "${eventRule}"`);
      }
      return result;
  } catch (error) {
    throw new Error(`Error updating event: ${error.message}`);
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

export { saveEvent, updateEvent, getEventsById, getEventBySource, deleteEvent };

