import express from "express";
import { config } from "dotenv";
import { jwt } from "twilio";
import cors from "cors";

import { checkAuth } from "./auth.js";

config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("hello video-mg");
});

app.post("/status-callback", (req, res) => {
  console.log("new status");
  console.log(req.body);

  res.end();
});

app.post("/login", (req, res) => {
  const body = req.body;
  console.log(body);
  const { username, password } = body;
  if (!username || !password) {
    console.log("fail");

    return res.status(401).json({ message: "incorrect username or password" });
  }
  if (checkAuth(username, password)) {
    return res.json({ token: "abc.123.xyz" });
  } else {
    return res.status(401).json({ message: "incorrect username or password" });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
