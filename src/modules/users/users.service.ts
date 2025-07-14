import type { PostgresService } from "../postgres/postgres.services";
import type { CreateUserDto } from "./dto/create-user.dto";

export class UsersService {
  constructor(private postgresService: PostgresService) {}

  async getAll({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {}) {
    const { rows: users } = await this.postgresService.client.query(
      `SELECT * FROM users LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return users;
  }

  async create({ email, pwd }: CreateUserDto) {
    const { rows: users } = await this.postgresService.client.query(
      `INSERT INTO users (email, pwd) VALUES ('${email}', '${pwd}');`,
    );

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
