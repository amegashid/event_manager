import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },

  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true
   },

   created_at: {
    type: Date,
    default: Date.now
   },

   updated_at: {
    type: Date,
    default: Date.now
   }
});

const Data = mongoose.model("Data", dataSchema);

async function saveData(data) {
  try {
    const newData = new Data(data);
    const savedData = await newData.save();
    return savedData;
  } catch (error) {
    throw new Error(`Failed to save data: ${error}`);
  }
}

async function updateData(data) {
  try {
    const updatedData = await Data.findOneAndUpdate(
      { _id: data._id }, 
      data, 
      { new: true, upsert: false } 
    );
    return updatedData;
  } catch (error) {
    throw new Error(error)
  }
}

async function fetchDataById(_id) {
  try {
    const query = { _id };
    const data = await Data.findOne(query);

    if (!data) {
      throw new Error(`Data ${_id} not found`)
    }

    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`)
  }
}

async function fetchAllData() {
  try {
    const allData = await Data.find({});
    return allData;
  } catch (error) {
    throw new Error(`Error fetching all data: ${error.message}`);
  }
}

export { saveData, fetchAllData, fetchDataById, updateData };
