import { Router } from "express";
import type { Controller } from "../../types/controller";
import type { OrdersService } from "./orders.service";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { createOrderDto } from "./dto/create-order.dto";

export class OrdersController implements Controller {
  private readonly _path;
  private readonly _router;

  constructor(private ordersService: OrdersService) {
    this._path = "/orders";
    this._router = Router();

    this.initRoutes();
  }

  get path() {
    return this._path;
  }

  get router() {
    return this._router;
  }

  private initRoutes() {

    this.router.get("/", async (req, res) => {
      const result = await this.ordersService.getAll({
        limit: req.query.limit,
        offset: req.query.offset,
      });
      res.send(result);
    });

    this.router.get("/:id", async (req, res) => {
      const result = await this.ordersService.getOne(req.params.id);
      res.send(result);
    });

    this.router.post("/",
      validateMiddleware(createOrderDto, "orders"),
      async (req, res) => {
        const result = await this.ordersService.create(req.body);
        res.send(result);
    });

    this.router.delete("/:id", async (req, res) => {
      const result = await this.ordersService.delete(req.params.id);
      res.send(result);
    });
  }
}
