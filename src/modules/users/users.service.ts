import {
  BadRequestError,
  NotFoundError,
} from "../../exceptions/error.exception";
import type { PrismaService } from "../prisma/prisma.service";
import type { RedisService } from "../redis/redis.services";
import type { CreateUserDto } from "./dto/create-user.dto";

export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async getAll({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {}) {
    return this.prismaService.user.findMany({
      take: limit,
    });
  }

  async create({ email, password }: CreateUserDto) {
    const existedUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existedUser) throw new BadRequestError("User already exists");

    const newUser = await this.prismaService.user.create({
      data: { email, password },
    });

    await this.redisService.client.del("users:*");

    return newUser;
  }

  async delete(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    return this.prismaService.user.delete({ where: { id: id } });
  }

  async getOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
