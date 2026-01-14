import app from "./src/app"

app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${3000}`);
});

