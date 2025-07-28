import { Router } from "express";
import type { Controller } from "../../types/controller";
import type { GoogleUsersService } from "./google-users.service";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { createGoogleUserDto } from "./dto/create-google-user.dto";

export class GoogleUsersController implements Controller {
  private readonly _path;
  private readonly _router;

  constructor(private googleUsersService: GoogleUsersService) {
    this._path = "/google-users";
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
      const result = await this.googleUsersService.getAll({
        limit: Number(req.query.limit) || 10,
        offset: Number(req.query.offset) || 0,
      });
      res.send(result);
    });

    this.router.get("/:id", async (req, res) => {
      const result = await this.googleUsersService.getOne(Number(req.params.id));
      res.send(result);
    });

    this.router.post(
      "/",
      validateMiddleware(createGoogleUserDto, "google-users"),
      async (req, res) => {
        const result = await this.googleUsersService.create(req.body);
        res.send(result);
      },
    );

    this.router.delete("/:id", async (req, res) => {
      const result = await this.googleUsersService.delete(Number(req.params.id));
      res.send(result);
    });
  }
}