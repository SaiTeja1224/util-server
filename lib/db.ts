import mongoose from "mongoose";

const MONGO_URI = Bun.env.MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

mongoose.connect(MONGO_URI);

console.log("DB connected!");

export default mongoose;
