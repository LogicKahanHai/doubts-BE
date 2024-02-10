import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  dbName: "Socket-io"
}).then(() => {
  console.log("MongoDB connected on port " + PORT);
}).catch((err) => {
  console.log("MongoDB connection failed " + err);
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

connection.on("error", (err) => {
  console.log("MongoDB connection failed " + err);
});

export default connection;
