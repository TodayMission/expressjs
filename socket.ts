import { Server } from "socket.io"
import { Server as HTTPServer} from "http"

export const initSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors : {origin: "*"}
  });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("message", (data) => {
            console.log("Received:", data);

            // broadcast to everyone
            io.emit("message", data);
        });

        socket.on("joinGroup", (groupId) => {
            if (!groupId) return

            socket.join(groupId)
            console.log("a user joined ", groupId)
        });

        socket.on('message-group', ({groupId, message}) => {
            console.log(groupId + " : " + message)
            socket.to(groupId).emit("message-group", {groupId, message})
        })

        socket.on("disconnect", () => {
            console.log("user Disconnected:", socket.id)
        })
    })
}