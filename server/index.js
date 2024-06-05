import http from "http";
import url from "url";
import { handleUpgradeMap } from "./handlers.js";
import { routes } from "./routes.js";

const PORT = 3001;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { method, url } = req;

  const route = routes.find(
    (r) => r.method === method && (r.path === url || !r.path)
  );

  if (route && route.action) {
    return route.action(req, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ errorMessage: "Not Found" }));
});

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  const map = handleUpgradeMap(request, socket, head);

  const upgradeHandler = map[pathname] || handleUpgradeMap["default"];

  upgradeHandler();
});

server.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
