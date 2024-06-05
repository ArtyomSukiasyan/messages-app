import { handleGetRequest, handlePostRequest } from "../controllers/message.js";

export const messageRoutes = [
  {
    method: "GET",
    path: "/messages",
    action: handleGetRequest,
  },
  {
    method: "POST",
    path: "/messages",
    action: handlePostRequest,
  },
];
