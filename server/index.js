const http = require("http");
const WebSocket = require("ws");
const url = require("url");

const PORT = 3001;
const messages = [];

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/messages") {
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

      messages.push(message);
      broadcast({ type: "ADD", message });

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Message created ${message}` }));
    });
  } else if (req.method === "GET" && req.url === "/messages") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ messages }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

const wss = new WebSocket.Server({ noServer: true });

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

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
