// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable inside .env.local"
  );
}


let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}


mongoose.connection.setMaxListeners(20); 


async function connectDB() {
  if (cached.conn) {
    console.log("♻️ Using existing MongoDB (Mongoose) connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Establishing new MongoDB (Mongoose) connection...");

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB (Mongoose) Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        cached.promise = null;
        throw new Error(`Database connection failed: ${error.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }

  return cached.conn;
}


function getConnectionStatus() {
  if (cached.conn) {
    return mongoose.connection.readyState;
  }
  return 0; 
}


mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected from DB");
});


process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});


export default connectDB;
export { connectDB, getConnectionStatus };