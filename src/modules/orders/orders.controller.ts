import { Controller } from "../../types/controller";
import type { OrdersService } from "./orders.service";

export class OrdersController extends Controller {
  constructor(private ordersService: OrdersService) {
    super("orders");
  }

  override initRoutes() {
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
