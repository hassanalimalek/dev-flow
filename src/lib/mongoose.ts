import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
 
    return;
  }
  if (!process.env.MONGO_DB_URI) {
 
    throw new Error("MONGO_DB_URI is not set");
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI as string, {
      dbName: process.env.MONGO_DB_NAME,
    });
    isConnected =
      db.connections[0].readyState === mongoose.ConnectionStates.connected;
  } catch (e) {
    console.error("error connecting to database");
    throw e;
  }
};
