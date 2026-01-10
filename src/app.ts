import express from "express";
require('dotenv').config();
import { challengeCreate, challengeGetAll } from "./controllers/challenges"


const app = express();

app.use(express.json());


app.get("/", (_req, res) => {
  res.json({ message: "Hello Express + TypeScript 🚀" });
});

//**
// CHALLENGES
//  */

app.post("/challenges/create/", challengeCreate)
app.get("/challenges/", challengeGetAll)

export default app