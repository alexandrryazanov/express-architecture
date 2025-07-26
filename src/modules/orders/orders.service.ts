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

  async delete({}: any) {
    // deleting
    return { id: 1, name: "order 1" };
  }

  async getOne() {
    return { id: 1, name: "order 1" };
  }
}
