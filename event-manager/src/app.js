import "dotenv/config";
import express from "express";
import cors from "cors";

import connectMongo from "./models/event/database.js";

// Connect to MongoDB
try {
    await connectMongo();
    console.log("Connected to MongoDB successfully.");
} catch (error) {
    console.log(error.message);
}

const app = express();

app.use(express.json());
app.use(cors());

export default app;
