// Import mongoose and its Mongoose type for TypeScript support
import mongoose, { Mongoose } from "mongoose";

// Retrieve MongoDB connection URL from environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// Define an interface for caching the mongoose connection and promise
interface MongooseConnection {
  conn: Mongoose | null; // The mongoose connection instance
  promise: Promise<Mongoose> | null; // The promise of the connection
}

// Attempt to retrieve cached mongoose connection from the global scope
let cached: MongooseConnection = (global as any).mongoose;

// Initialize the cache if it doesn't exist
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Function to connect to the MongoDB database
export const connectTODatabase = async () => {
  // Return the existing connection if it's already established
  if (cached.conn) return cached.conn;

  // Throw an error if the MongoDB URL is not provided
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // Only create a new connection promise if one does not already exist
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "imaginify", // Specify the database name
      bufferCommands: false, // Disable Mongoose's buffering to avoid issues in serverless environments
    });

  // Await the connection promise and cache the resolved connection
  cached.conn = await cached.promise;

  // Return the established mongoose connection
  return cached.conn;
};
