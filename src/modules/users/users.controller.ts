import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import type { Controller } from "../../types/controller";
import { createUserDto } from "./dto/create-user.dto";
import type { UsersService } from "./users.service";

export class UsersController implements Controller {
  private readonly _path;
  private readonly _router;

  constructor(private usersService: UsersService) {
    this._path = "/users";
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
      const result = await this.usersService.getAll({
        limit: req.query.limit,
        offset: req.query.offset,
      });
      res.send(result);
    });

    this.router.get("/:id", (req, res) => {
      const result = this.usersService.getOne();
      res.send(result);
    });

    this.router.post(
      "/",
      validateMiddleware(createUserDto, "users"),
      (req, res) => {
        const result = this.usersService.create(req.body);
        res.send(result);
      },
    );

    this.router.delete("/:id", (req, res) => {
      const result = this.usersService.delete(req.params.id);
      res.send(result);
    });
  }
}
