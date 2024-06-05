import { handleGetRequest, handlePostRequest } from "../../handlers.js";

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
