import type { PostgresService } from "../postgres/postgres.services";
import type { RedisService } from "../redis/redis.services";
import type { CreateOrderDto } from "./dto/create-order.dto";

export class OrdersService {
  private readonly _tableName = "orders";

  constructor(
    private postgresService: PostgresService,
    private redisService: RedisService,
  ) {}

  async getAll({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {})  {

    const redisKey = `orders:${limit}:${offset}`;
    console.log("redisKey = " + redisKey)

    const redisOrders = await this.redisService.client.get(redisKey);
    if (redisOrders) {
      console.log("get data from redis");
      return JSON.parse(redisOrders);
    }

    const { rows: orders } = await this.postgresService.client.query(
      `SELECT * FROM ${this._tableName} LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    await this.redisService.client.set(redisKey, JSON.stringify(orders));

    return orders;
  }

  async create({ userId, productName, amount }: CreateOrderDto) {
    try {
      const { rows: orders } = await this.postgresService.client.query(
        `INSERT INTO ${this._tableName} (user_id, product_name, amount) ` + 
        `VALUES (${userId}, '${productName}', ${amount});`,
      );

      try {
        await this.redisService.deleteKeys("orders*");
      } catch (e) {
        console.log("error on redis:deleteKeys, error:", e);
      }

      return orders;
    } catch (e) {
      return {error: "Couldn't create new order (" + e + ")"}
    }
  }

  async delete(id: number) {
    const result = await this.postgresService.client.query(
      `DELETE FROM ${this._tableName} WHERE id = $1`,
      [id],
    );
    console.log("result = ", result);

    if (result.rowCount === 0) {
      return { message: `Couldn't delete order Id = ${id}` };
    }

    return result.rows[0];
  }

  async getOne(id: number) {
    const result = await this.postgresService.client.query(
      `SELECT * FROM ${this._tableName} WHERE id = $1`,
      [id],
    );
    
    if (result.rows.length === 0) {
      return { message: `Couldn't find order Id = ${id}` };
    }

    return result.rows[0];
  }

}
