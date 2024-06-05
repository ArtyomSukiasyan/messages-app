import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import url from "url";

const PORT = 3001;
const messages = [];
const maxMessages = 9;

const handleOptionsRequest = (res) => {
  res.writeHead(204);
  res.end();
};

const sendMessage = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { message } = JSON.parse(body);
    if (!message) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Message content is required" }));
      return;
    }

    if (messages.length >= maxMessages) {
      const deletedMessage = messages.shift();
      broadcast({ type: "DELETE", message: deletedMessage });
    }

    messages.push(message);
    broadcast({ type: "ADD", message });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Message created ${message}` }));
  });
};

const getMessage = (res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ messages }));
};

const handleNotFound = (res) => {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const requestHandlerMap = {
    OPTIONS: handleOptionsRequest,
    POST: () =>
      req.url === "/messages" ? sendMessage(req, res) : handleNotFound(res),
    GET: () =>
      req.url === "/messages" ? getMessage(res) : handleNotFound(res),
  };

  (requestHandlerMap[req.method] || handleNotFound)(res);
});

const wss = new WebSocketServer({ noServer: true });

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

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  const handleUpgradeMap = {
    "/ws": () =>
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      }),
    default: () => socket.destroy(),
  };

  (handleUpgradeMap[pathname] || handleUpgradeMap["default"])();
});

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
