import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);  // Set strict query mode for Mongoose to prevent unknown field queries.

    if (!process.env.MONGODB_URI) return console.log("Missing MongoDB URL");

    if (isConnected) { // If the connection is already established, return without creating a new connection.
        console.log("MongoDB connection already established");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true; // Set the connection status to true
        console.log("MongoDB connected");
    } 
    catch (error){ console.log(error); }
};