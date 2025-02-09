import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ host: "0.0.0.0", port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", function (socket) {
    userCount++;
    allSockets.push(socket);
    console.log(`New User Connected, usercount:: #${userCount}`);

    socket.on("message", (data) => {
        const { sender, message } = JSON.parse(data.toString());
        console.log(`Recieved: ${message} from ${sender}`);
        allSockets.forEach(sockets => {
            if(sockets !== socket) {
                sockets.send(JSON.stringify({ sender, message }));
            }
        })
    })

    socket.on("close", () => {
        userCount--;
        console.log(`user diconected, usercount ${userCount}`);
        allSockets = allSockets.filter((sockets) => sockets !== socket);
    })
})