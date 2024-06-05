import { handleOptionsRequest } from "../../handlers.js";

export const commonRoutes = [
  {
    method: "OPTIONS",
    action: handleOptionsRequest,
  },
];
