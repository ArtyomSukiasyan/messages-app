import http from "http";
import url from "url";
import {
  handleOptionsRequest,
  handlePostRequest,
  handleGetRequest,
  handleNotFound,
  handleUpgradeMap,
} from "./handlers.js";

const PORT = 3001;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const requestHandlerMap = {
    OPTIONS: handleOptionsRequest,
    POST: () =>
      req.url === "/messages"
        ? handlePostRequest(req, res)
        : handleNotFound(res),
    GET: () =>
      req.url === "/messages" ? handleGetRequest(res) : handleNotFound(res),
  };

  (requestHandlerMap[req.method] || handleNotFound)(res);
});

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  const map = handleUpgradeMap(request, socket, head);

  (map[pathname] || handleUpgradeMap["default"])();
});

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
