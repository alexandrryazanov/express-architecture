import process from "node:process";
import { PrismaClient } from "../../../generated/prisma";

export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log:
        process.env.ENV !== "production"
          ? ["query", "error", "info", "warn"]
          : undefined,
    });
  }
}
