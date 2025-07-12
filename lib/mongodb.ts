import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://indianlancer1802:JXMEDBM0jrlzzIDW@my-portfolio.ccbrgqy.mongodb.net/portfolio?retryWrites=true&w=majority&appName=my-portfolio"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Fix for Next.js global type issue
declare global {
  var _mongoose: any
}

let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
