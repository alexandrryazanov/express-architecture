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
}
