import { NotFoundError } from "../../exceptions/error.exception";
import type { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.order.findMany({
      include: {
        items: true,
      },
    });
  }

  async create({ userId, itemIds }: CreateOrderDto) {
    const user = this.prismaService.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }

    const itemsCount = await this.prismaService.item.count({
      where: { id: { in: itemIds } },
    });

    if (itemsCount !== itemIds.length) {
      throw new NotFoundError("Some items not found");
    }

    const connectArray = itemIds.map((itemId) => ({ id: itemId }));

    return this.prismaService.order.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          connect: connectArray,
        },
      },
      include: {
        items: true,
        user: { select: { id: true, email: true } },
      },
    });
  }

  async delete(id: number) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundError("Order not found");

    return this.prismaService.order.delete({
      where: { id },
    });
  }

  async getOne(id: number) {
    const order = this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundError("Order not found");

    return order;
  }
}
