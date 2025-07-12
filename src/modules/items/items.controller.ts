import { Router } from "express";
import type { Controller } from "../../types/controller";
import type { ItemsService } from "./items.service";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { createItemDto } from "./dto/create-item.dto";

export class ItemsController implements Controller {
  private readonly _path;
  private readonly _router;

  constructor(private itemsService: ItemsService) {
    this._path = "/items";
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
      const result = this.itemsService.getAll();
      res.send(result);
    });

    this.router.get("/:id", (req, res) => {
      const result = this.itemsService.getOne(req.params.id);
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
      const result = this.itemsService.delete(req.params.id);
      res.send(result);
    });
  }
}
