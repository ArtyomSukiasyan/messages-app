import {
  handleGetRequest,
  handleOptionsRequest,
  handlePostRequest,
} from "./handlers.js";

export const routes = [
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
  {
    method: "OPTIONS",
    action: handleOptionsRequest,
  },
];
