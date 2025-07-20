import { createClient } from "redis";

export class RedisService {
  private _client: any;

  constructor() {
    this._client = createClient().on("error", (err) =>
      console.log("Redis Client Error", err),
    );
  }

  async connect() {
    await this._client.connect();
  }

  async disconnect() {
    await this._client.destroy();
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
