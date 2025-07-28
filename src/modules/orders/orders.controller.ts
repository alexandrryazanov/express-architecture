import { Router } from "express";
import type { Controller } from "../../types/controller";
import type { OrdersService } from "./orders.service";

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
    this.router.get("/", (req, res) => {
      const result = this.ordersService.getAll();
      res.send(result);
    });

    this.router.get("/:id", (req, res) => {
      const result = this.ordersService.getOne();
      res.send(result);
    });

    this.router.post("/", (req, res) => {
      const result = this.ordersService.create(req.body);
      res.send(result);
    });

    this.router.delete("/:id", (req, res) => {
      const result = this.ordersService.delete(req.params.id);
      res.send(result);
    });
  }
}
