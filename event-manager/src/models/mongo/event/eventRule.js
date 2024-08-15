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
        type: mongoose.Schema.Types.Mixed,
    }
});

// Create a index on the event rule collection for each event rule
// EventRuleSchema.index({ source: 1, sourceType: 1});

const EventRule = mongoose.model('Event-Rule', EventRuleSchema);

async function saveEventRule(eventRule){
    try {
        const newRole = new EventRule(eventRule);
        return await newRole.save();
    } catch (error) {
        throw new Error(`Error saving event rule ${eventRule._id}: ${error.message}`);
    }
}

async function getAllEventsRule() {
  try {
    const eventRules = await EventRule.find({});
    if (!eventRules) {
      throw new Error("No event rules found");
    }
    return eventRules;
  } catch (error) {
    throw new Error(`Error fetching all event rules: ${error}`);
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

// async function getEventRuleBuSource(source) {
//   if (!source) {
//     throw new Error("Invalid or missing 'source' parameter");
//   }

//   try {
//     const eventRules = await EventRule.find({ source });
//     if (!eventRules) {
//       throw new Error(`No event rules found with source "${source}"`);
//     }
//     return eventRules;
//   } catch (error) {
//     throw new Error(`Error fetching event rules with source "${source}": ${error.message}`);
//   }
// }

// async function getEventRuleBySourceType(sourceType) {
//   if (!sourceType) {
//     throw new Error("Invalid or missing 'sourceType' parameter");
//   }

//   try {
//     const eventRules = await EventRule.find({ sourceType });
//     if (!eventRules) {
//       throw new Error(`No event rules found with source type "${sourceType}"`);
//     }
//     return eventRules;
//   } catch (error) {
//     throw new Error(`Error fetching event rules with source type "${sourceType}": ${error.message}`);
//   }
// }
async function updateEventRule(_id, updates) {
    if (!_id) {
      throw new Error("Error updating event rule: Invalid or missing '_id' parameter");
    }
  
    if (!updates || typeof updates !== "object") {
      throw new Error("Error updating event rule: Invalid updates object");
    }
  
    updates.updatedAt = new Date();
  
    try {
      const updatedEventRule = await EventRule.findByIdAndUpdate(
        _id,
        { ...updates },
        { new: true }
      );
  
      if (!updatedEventRule) {
        throw new Error(`Error updating event rule: Event rule "${_id}" not found in update`);
      }
  
      return updatedEventRule;
    } catch (error) {
      throw new Error(`Error updating event rule "${_id}": ${error.message}`);
    }
}

async function deleteEventRule(_id) {
  if (!_id) {
    throw new Error("Error deleting event rule: Invalid or missing '_id' parameter");
  }

  try {
    const deletedEventRule = await EventRule.findByIdAndDelete(_id);
    if (!deletedEventRule) {
      throw new Error(`Error deleting event rule: Event rule "${_id}" not found in delete`);
    }

    return deletedEventRule;
  } catch (error) {
    throw new Error(`Error deleting event rule "${_id}": ${error.message}`);
  }
}


export { saveEventRule, getEventRuleById,updateEventRule, deleteEventRule, getAllEventsRule };
