import { cacheMiddleware } from "../../middlewares/cache.middleware";
import { validateMiddleware } from "../../middlewares/validation.middleware";
import { Controller } from "../../types/controller";
import type { RedisService } from "../redis/redis.services";
import { createUserDto } from "./dto/create-user.dto";
import type { UsersService } from "./users.service";

export class UsersController extends Controller {
  constructor(
    private usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    super("users");
  }

  initRoutes() {
    this.router.get(
      "/",
      cacheMiddleware(this.redisService),
      async (req, res) => {
        const result = await this.usersService.getAll({
          limit: Number(req.query.limit || 10),
          offset: Number(req.query.offset || 0),
        });
        res.send(result);
      },
    );

    this.router.get("/:id", cacheMiddleware(this.redisService), (req, res) => {
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
