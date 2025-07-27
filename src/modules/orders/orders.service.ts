import {
  NotFoundError,
} from "../../exceptions/error.exception";
import type { PrismaService } from "../prisma/prisma.service";

export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.order.findMany({
      include: {
        items: true,
      },
    });
  }

  async create({}: any) {
    // creating in DB
    return this.prismaService.order.create({
      data: {
        user: { connect: { id: 1 } },
        items: {
          connect: [{ id: 1 }, { id: 2 }],
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
