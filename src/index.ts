import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();

import { useAuth } from "./middlewares.js";
import { checkAuth, generateAuthToken } from "./auth.js";
import { generateTwilioToken } from "./twilio.js";


const app = express();

app.use(express.json());
app.use(cors());

// routes
app.post("/status-callback", (req, res) => {
  console.log("new status");
  console.log(req.body);

  res.end();
});

app.post("/login", (req, res) => {
  const body = req.body;
  const { username, password } = body;
  if (!username || !password) {
    return res.status(403).json({ message: "incorrect username or password" });
  }
  if (checkAuth(username, password)) {
    const token = generateAuthToken(username);

    return res.json({ token });
  } else {
    return res.status(403).json({ message: "incorrect username or password" });
  }
});

// authhenticated routes
app.use(useAuth);

app.get("/", (req, res) => {
  const identity = req.user;
  if (!identity) {
    return res.status(401).json({ message: "unauthorized" });
  }
  let room = req.query.room;
  if (!room || typeof room !== "string") {
    room = "Default Room";
  }

  const token = generateTwilioToken(identity, room);

  res.json({ token });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
