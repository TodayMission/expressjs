import http from "http"
import app from "./src/app"
import { initSocket } from "./socket";
const hserver = http.createServer(app) 

initSocket(hserver)

hserver.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`);
});

