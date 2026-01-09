import express from "express";
require('dotenv').config();
import { challenges } from "./challenges";
import { database } from "./data";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello Express + TypeScript 🚀" });
});

app.get("/challenges/create", (_req, res) => {
  let challenge: challenges = new challenges(new database);

  challenge.create("test")

  res.json({ message: "Success"});
})

export default app