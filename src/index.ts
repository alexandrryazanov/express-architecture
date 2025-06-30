import express from "express";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import type { Controller } from "./types/controller";

const app = express();

app.use(express.json());

app.listen(3000, () => console.log("Server is running on port 3000"));

const ordersService = new OrdersService();
const usersService = new UsersService();

const controllers: Controller[] = [
  new UsersController(usersService),
  new OrdersController(ordersService),
];

controllers.forEach((controller) =>
  app.use(controller.path, controller.router),
);

app.use(errorLoggerMiddleware);
app.use(errorMiddleware);
