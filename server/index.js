const http = require("http");

const PORT = 3001;

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Message created` }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
