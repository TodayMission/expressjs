import { Server } from "socket.io"
import { Server as HTTPServer} from "http"
import http from "http"
import app from "./src/app"

const initSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors : {origin: "*"}
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  })
}

const hserver = http.createServer(app) 

initSocket(hserver)

hserver.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`);
});

