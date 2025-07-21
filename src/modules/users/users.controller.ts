import { validateMiddleware } from "../../middlewares/validation.middleware";
import { Controller } from "../../types/controller";
import { createUserDto } from "./dto/create-user.dto";
import type { UsersService } from "./users.service";

export class UsersController extends Controller {
  constructor(private usersService: UsersService) {
    super("users");
  }

  override initRoutes() {
    this.router.get(
      "/",
      // cacheMiddleware(this.redisService),
      async (req, res) => {
        const result = await this.usersService.getAll({
          limit: Number(req.query.limit || 10),
          offset: Number(req.query.offset || 0),
        });
        res.send(result);
      },
    );

    this.router.get(
      "/:id",
      // cacheMiddleware(this.redisService),
      async (req, res) => {
        const result = await this.usersService.getOne(Number(req.params.id));
        res.send(result);
      },
    );

    this.router.post(
      "/",
      validateMiddleware(createUserDto, "users"),
      async (req, res) => {
        const result = await this.usersService.create(req.body);
        res.send(result);
      },
    );

    this.router.delete("/:id", async (req, res) => {
      const result = await this.usersService.delete(Number(req.params.id));
      res.send(result);
    });
  }
}
