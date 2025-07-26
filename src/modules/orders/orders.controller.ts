import { Controller } from "../../types/controller";
import type { OrdersService } from "./orders.service";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { createOrderDto } from "./dto/create-order.dto";

export class OrdersController extends Controller {
  constructor(private ordersService: OrdersService) {
    super("orders");
  }

  override initRoutes() {
    this.router.get("/", async (req, res) => {
      const result = await this.ordersService.getAll();
      res.send(result);
    });

    this.router.get("/:id", async (req, res) => {
      const result = await this.ordersService.getOne();
      res.send(result);
    });

    this.router.post("/", async (req, res) => {
      const result = await this.ordersService.create(req.body);
      res.send(result);
    });

    this.router.delete("/:id", async (req, res) => {
      const result = await this.ordersService.delete(req.params.id);
      res.send(result);
    });
  }
}
