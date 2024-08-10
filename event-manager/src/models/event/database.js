import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const DATABASE = "/test_db";

// Connect to MongoDB
const connectMongo = async () => {
    try {
        await mongoose.connect(MONGODB_URL + DATABASE);
    } catch (error) {
        throw new Error(`Could not connect to MongoDB: ${error.message}`);
    }
}

export default connectMongo;