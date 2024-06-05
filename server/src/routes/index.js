import { commonRoutes } from "./commonRoutes.js";
import { messageRoutes } from "./messageRoutes.js";

export const routes = [...messageRoutes, ...commonRoutes];
