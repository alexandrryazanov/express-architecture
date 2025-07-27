import {
  NotFoundError,
} from "../../exceptions/error.exception";
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
    // creating in DB
    const connectArray = (itemIds as number[]).map((itemId) => ({ id : itemId }));
    return this.prismaService.order.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          // connect: [{ id: 1 }, { id: 2 }],
          // map((i) => ({id: i}))
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
