import express from "express";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import type { Controller } from "./types/controller";

import { CryptoService } from "./services/crypto/crypto.service"
import {ConfigController} from "./config/config.controller";
import {ConfigService} from "./config/config.service";

const app = express();

app.use(express.json());

app.listen(3000, () => console.log("Server is running on port 3000"));

const ordersService = new OrdersService();
const usersService = new UsersService();
const configService = new ConfigService();

const controllers: Controller[] = [
  new UsersController(usersService),
  new OrdersController(ordersService),
  new ConfigController(configService),
];

controllers.forEach((controller) =>
  app.use(controller.path, controller.router),
);

app.use(errorLoggerMiddleware);
app.use(errorMiddleware);

if (1) { 
  const mc = new CryptoService("my_super_secret_frase");
  // const mc = new CryptoService();
  
  const h1 = mc.getMd5("123123123123123123");
  console.log("hash(md5):", h1);

  const h2 = mc.getSha256("123123123123123123");
  console.log("hash(sha256):", h2);

  const h3 = mc.getHmacMd5("123123123123123123");
  console.log("hmac(md5):", h3);

  const h4 = mc.getHmacSha256("123123123123123123");
  console.log("hmac(sha256):", h4);

  const message = "super message 1"
  const e1 = mc.encryptAes(message);
  const d1 = mc.decryptAes(e1);
  
  console.log("message:", message);
  console.log("encryption(AES):", e1);
  console.log("decryption(AES):", d1);
}