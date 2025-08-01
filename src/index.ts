import express from "express";
import * as process from "node:process";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";
import { PrismaService } from "./modules/prisma/prisma.service";
import { RedisService } from "./modules/redis/redis.services";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import type { Controller } from "./types/controller";
import { ConfigService } from "./modules/config/config.service";
import { ConfigController } from "./modules/config/config.controller";
import { ItemsService } from "./modules/items/items.service";
import { ItemsController } from "./modules/items/items.controller";

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, async () => {
  console.log(`[SERVER] Listening post ${PORT}...`);

  /* Middlewares */
  app.use(express.json());

  /* Services */
  const prismaService = new PrismaService();
  const redisService = new RedisService();
  const ordersService = new OrdersService(prismaService);
  const usersService = new UsersService(prismaService, redisService);
  const itemsService = new ItemsService();
  const configService = new ConfigService();

  /* Controllers */
  [
    new UsersController(usersService),
    new OrdersController(ordersService),
    new ConfigController(configService),
    new ItemsController(itemsService),
  ].forEach((controller: Controller) => controller.connect(app));

  /* Databases */
  redisService.connect();

  /* Error middlewares */
  app.use(errorLoggerMiddleware);
  app.use(errorMiddleware);
});
