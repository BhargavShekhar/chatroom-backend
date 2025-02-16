import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ host: "0.0.0.0", port: 8080 });

let allSockets: WebSocket[] = [];

const broadcastUserCount = () => {
    allSockets.forEach(socket => {
        socket.send(JSON.stringify({ userCount: allSockets.length }));
    })
}

wss.on("connection", function (socket) {
    allSockets.push(socket);
    console.log(`New User Connected, usercount:: #${allSockets.length}`);

    broadcastUserCount();

    socket.on("message", (data) => {
        const { sender, message, type } = JSON.parse(data.toString());
        // console.log(`Recieved: ${message} from ${sender}`);
        if(type === "getUserCount") {
            socket.send(JSON.stringify({ userCount: allSockets.length }));
            return;
        }
        allSockets.forEach(sockets => {
            if (sockets !== socket) {
                sockets.send(JSON.stringify({ sender, message }));
            }
        })
    })

    socket.on("close", () => {
        console.log(`user diconected, usercount ${allSockets.length}`);
        allSockets = allSockets.filter((sockets) => sockets !== socket);

        broadcastUserCount();
    })
})