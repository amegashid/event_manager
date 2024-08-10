import mongoose from "mongoose";

const EventRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sourceType: {
        type: String,
        required: true
    },
    details: {
        type: Object,
        required: true
    }
});

const EventRule = mongoose.model('Event-Rule', EventRuleSchema);

async function saveEventRule(eventRule){
    try {
        const role = EventRule.findById(eventRule._id);
        if (role) {
            throw new Error(`Event rule with id ${eventRule._id} already exists`);
        }   

        const newRole = new EventRule(eventRule);
        return await newRole.save();
    } catch (error) {
        throw new Error(`Error saving event rule ${eventRule._id}: ${error.message}`);
    }
}

async function getEventRuleById(_id) {
    if (!_id) {
      throw new Error("Invalid or missing '_id' parameter");
    }
  
    try {
      const eventRule = await EventRule.findById(_id);
      if (!eventRule) {
        throw new Error(`Event rule "${_id}" not found in fetch`);
      }
      return eventRule;
    } catch (error) {
      throw new Error(`Error fetching event rule "${_id}": ${error.message}`);
    }
  }
async function updateEventRule(_id, updates) {
    if (!_id) {
      throw new Error("Invalid or missing '_id' parameter");
    }
  
    if (!updates || typeof updates !== "object") {
      throw new Error("Invalid updates object");
    }
  
    updates.updatedAt = new Date();
  
    try {
      const updatedEventRule = await EventRule.findByIdAndUpdate(
        _id,
        { ...updates },
        { new: true }
      );
  
      if (!updatedEventRule) {
        throw new Error(`Event rule "${_id}" not found in update`);
      }
  
      return updatedEventRule;
    } catch (error) {
      throw new Error(`Error updating event rule "${_id}": ${error.message}`);
    }
}


async function deleteEventRule(_id) {
  if (!_id) {
    throw new Error("Invalid or missing '_id' parameter");
  }

  try {
    const deletedEventRule = await EventType.findByIdAndDelete(_id);

    if (!deletedEventRule) {
      throw new Error(`Event rule "${_id}" not found in delete`);
    }

    return deletedEventRule;
  } catch (error) {
    throw new Error(`Error deleting event rule "${_id}": ${error.message}`);
  }
}


export { saveEventRule, getEventRuleById,updateEventRule, deleteEventRule };