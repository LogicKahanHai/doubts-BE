import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connection from "./conn.js";
import Msg from "./model.js";

const PORT = process.env.PORT || 5000;
dotenv.config();
const app = Express();
app.use(Express.json());
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://13.233.79.221/",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("connected", "Connected to server");

  console.log(
    "User connected! Total connected clients: ",
    io.engine.clientsCount
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("newMessage", async (msg) => {
    try {
      const newMsg = new Msg(msg);
      await newMsg.save();
      // Emit the new message to all connected clients except the sender
      socket.broadcast.emit("newMessage", newMsg);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.get("/loadMsgs", async (req, res) => {
  try {
    console.log("Getting messages");
    const msgs = await Msg.find();
    res.json(msgs);
    // console.log(msgs);
  } catch (err) {
    res.status(500).send("Failed to retrieve messages due to " + err);
  }
});

app.post("/msg", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const msg = req.body.msg;
  const newMsg = new Msg({
    name,
    email,
    msg,
  });
  try {
    await newMsg.save();
    // Emit new message to all connected clients except the sender
    io.emit("newMessage", newMsg);
    res.send("Message sent successfully");
  } catch (err) {
    res.send("Failed to send message: " + err);
  }
});

export default app;
