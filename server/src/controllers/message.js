import { broadcast } from "./webSocket.js";

const messages = [];
const maxMessages = 9;

const handleOptionsRequest = (req, res) => {
  res.writeHead(204);
  res.end();
};

const handlePostRequest = (req, res) => {
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

const handleGetRequest = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ messages }));
};

const handleNotFound = (req, res) => {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
};

export {
  handleOptionsRequest,
  handlePostRequest,
  handleGetRequest,
  handleNotFound,
  messages,
};
