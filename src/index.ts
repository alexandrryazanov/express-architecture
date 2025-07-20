import express from "express";
import * as process from "node:process";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";
import { PostgresService } from "./modules/postgres/postgres.services";
import { RedisService } from "./modules/redis/redis.services";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import type { Controller } from "./types/controller";

import { ConfigService } from "./config/config.service";
import { ConfigController } from "./config/config.controller";
import { ItemsService } from "./modules/items/items.service";
import { ItemsController } from "./modules/items/items.controller";

const app = express();

app.use(express.json());

app.listen(3000, async () => {
  console.log("Server is running on port 3000");

  const redisService = new RedisService();
  const postgresService = new PostgresService();
  const ordersService = new OrdersService(postgresService);
  const usersService = new UsersService(postgresService, redisService);
  const itemsService = new ItemsService();
  const configService = new ConfigService();

  const controllers: Controller[] = [
    new UsersController(usersService),
    new OrdersController(ordersService),
    new ConfigController(configService),
    new ItemsController(itemsService),
  ];

  controllers.forEach((controller) =>
    app.use(controller.path, controller.router),
  );

  try {
    await postgresService.connect();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Could not connect to postgres", error);
    process.exit(1);
  }

  try {
    await redisService.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Could not connect to Redis", error);
    process.exit(1);
  }
});

app.use(errorLoggerMiddleware);
app.use(errorMiddleware);
