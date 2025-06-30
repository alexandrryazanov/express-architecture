import { NotFoundError } from "../../extensions/error.extension";
import type { CreateUserDto } from "./dto/create-user.dto";

export class UsersService {
  getAll() {
    return [
      { id: 1, name: "user 1" },
      { id: 2, name: "user 2" },
    ];
  }

  create(params: CreateUserDto) {
    throw new NotFoundError("User 1 not found", "users");
    // return { id: 1, name: params.name, age: params.age, email: params.email };
  }

  delete({}: any) {
    // deleting
    return { id: 1, name: "user 1" };
  }

  getOne() {
    return { id: 1, name: "user 1" };
  }
}
