import process from "node:process";
import { createClient } from "redis";

export class RedisService {
  private readonly _client: ReturnType<typeof createClient>;

  constructor() {
    this._client = createClient().on("error", (err) =>
      console.log("[REDIS] Client Error", err),
    );
  }

  async connect() {
    try {
      await this._client.connect();
      console.log("[REDIS] Connected to Redis");
    } catch (error) {
      console.error("[REDIS] Could not connect to Redis", error);
      process.exit(1);
    }
  }

  disconnect() {
    this._client.destroy();
  }

  get client() {
    return this._client;
  }

  async deleteKeys(prefix: string) {
    let cursor = '0';
    let deletedCount = 0;

    do {
      const reply = await this._client.scan(cursor, {
        MATCH: `${prefix}*`, 
        COUNT: 100,
      });

      cursor = reply.cursor;
      const keys = reply.keys;

      if (keys.length > 0) {
        await this._client.del(keys);
        deletedCount += keys.length;
      }
    } while (cursor !== '0');

    console.log("number of deleted keys from redis: ${deletedCount}");
  }
}
