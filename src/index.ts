import express from "express";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import type { Controller } from "./types/controller";

import { MyCrypto } from "./services/crypto/crypto.service"

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

if (1) { 
  const mc = new MyCrypto("my_super_secret_frase");

  const h1 = mc.getSha256("123123123123123123");
  console.log("hash:", h1)

  const h2 = mc.getHmacMd5("123123123123123123");
  console.log("hmac(md5):", h2)

  const h3 = mc.getHmacSha256("123123123123123123");
  console.log("hmac(sha256):", h3)

  const message = "super message 1"
  const e1 = mc.encryptAes(message);
  const d1 = mc.decryptAes(e1);

  console.log("message:", message);
  console.log("encryption(AES):", e1);
  console.log("decyption(AES):", d1);
}