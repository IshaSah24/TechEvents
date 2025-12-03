// app/lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: {
    conn?: Mongoose | null;
    promise?: Promise<Mongoose> | null;
  } | undefined;
}

// Optional: mongoose options (adjust if your TS/Mongoose version complains)
const mongooseOptions: mongoose.ConnectOptions | Record<string, any> = {
  bufferCommands: false,
};

export async function connectToDatabase(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  // don't log the URI itself. only boolean for safety.
  console.log("MONGODB_URI set?", !!MONGODB_URI);

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local or your deployment settings."
    );
  }

  // Production: just connect and return
  if (process.env.NODE_ENV === "production") {
    return mongoose.connect(MONGODB_URI, mongooseOptions);
  }

  // Dev: keep a global cached connection to avoid multiple connections during HMR
  if (!globalThis.__mongoose) {
    globalThis.__mongoose = { conn: null, promise: null };
  }

  if (globalThis.__mongoose.conn) {
    return Promise.resolve(globalThis.__mongoose.conn);
  }

  if (!globalThis.__mongoose.promise) {
    globalThis.__mongoose.promise = mongoose
      .connect(MONGODB_URI, mongooseOptions)
      .then((m) => m)
      .catch((err) => {
        globalThis.__mongoose = { conn: null, promise: null };
        throw err;
      });
  }

  globalThis.__mongoose.conn = await globalThis.__mongoose.promise;
  return globalThis.__mongoose.conn;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();

  if (process.env.NODE_ENV !== "production") {
    globalThis.__mongoose = { conn: null, promise: null };
  }
}
