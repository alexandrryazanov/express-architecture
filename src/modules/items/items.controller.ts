import { Controller } from "../../types/controller";
import type { ItemsService } from "./items.service";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { createItemDto } from "./dto/create-item.dto";

export class ItemsController extends Controller {
  constructor(private itemsService: ItemsService) {
    super("items");
  }

  override initRoutes() {
    this.router.get("/", (req, res) => {
      const result = this.itemsService.getAll();
      res.send(result);
    });

    this.router.get("/:id", (req, res) => {
      const result = this.itemsService.getOne(+req.params.id);
      res.send(result);
    });

    this.router.post(
      "/",
      validateMiddleware(createItemDto, "items"),
      (req, res) => {
        const result = this.itemsService.create(req.body);
        res.send(result);
      },
    );

    this.router.delete("/:id", (req, res) => {
      const result = this.itemsService.delete(+req.params.id);
      res.send(result);
    });
  }
}
