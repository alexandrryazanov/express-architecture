import type { PostgresService } from "../postgres/postgres.services";
import type { CreateUserDto } from "./dto/create-user.dto";

export class UsersService {
  constructor(private postgresService: PostgresService) {}

  async getAll() {
    const { rows: users } = await this.postgresService.client.query(
      "SELECT * FROM t_users",
    );

    return users;
  }

  async create({ email, pwd }: CreateUserDto) {
    const { rows: users } = await this.postgresService.client.query(
      `INSERT INTO t_users (email, pwd) VALUES ('${email}', '${pwd}');`,
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
