import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello Express + TypeScript 🚀" });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`);
});