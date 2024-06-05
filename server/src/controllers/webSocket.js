import WebSocket, { WebSocketServer } from "ws";
import { messages } from "./message.js";

const wss = new WebSocketServer({ noServer: true });

const handleUpgradeMap = (request, socket, head) => {
  return {
    "/ws": () =>
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      }),
    default: () => socket.destroy(),
  };
};

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "INIT", messages }));
});

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

export { handleUpgradeMap, broadcast };
