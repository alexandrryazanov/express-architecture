import type { PostgresService } from "../postgres/postgres.services";
import type { RedisService } from "../redis/redis.services";
import type { CreateUserDto } from "./dto/create-user.dto";

export class UsersService {
  constructor(
    private postgresService: PostgresService,
    private redisService: RedisService,
  ) {}

  async getAll({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {}) {
    const redisUsers = await this.redisService.client.get(
      `users:${limit}:${offset}`,
    );
    if (redisUsers) return JSON.parse(redisUsers);

    const { rows: users } = await this.postgresService.client.query(
      `SELECT * FROM users LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    await this.redisService.client.set("users", JSON.stringify(users));

    return users;
  }

  async create({ email, pwd }: CreateUserDto) {
    const { rows: users } = await this.postgresService.client.query(
      `INSERT INTO users (email, pwd) VALUES ('${email}', '${pwd}');`,
    );

    await this.redisService.client.del("users:*");

    return users;
  }

  delete({}: any) {
    // deleting
    return { id: 1, name: "user 1" };
  }

  getOne() {
    return { id: 1, name: "user 1" };
  }
}
