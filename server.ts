import app from "./src/app"
require('dotenv').config();

import { db } from "./src/database"

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`);
});

