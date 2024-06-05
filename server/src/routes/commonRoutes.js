import { handleOptionsRequest } from "../controllers/message.js";

export const commonRoutes = [
  {
    method: "OPTIONS",
    action: handleOptionsRequest,
  },
];
