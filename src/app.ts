import express from "express";
require('dotenv').config();
import { challengeCreate, challengeGetAll, challengeJoin, challengeLeave, challengeCancel } from "./controllers/challenges"


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
app.post("/challenges/join/", challengeJoin)
app.delete("/challenges/leave/", challengeLeave)
app.delete("/challenges/cancel/", challengeCancel)


export default app