import process from "node:process";
import { Client } from "pg";

export class PostgresService {
  private readonly _client: Client;

  constructor() {
    this._client = new Client({
      host: "localhost",
      port: 5432,
      user: "admin",
      password: "admin",
      database: "main",
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("[POSTGRES] Connected to Postgres");
    } catch (error) {
      console.error("[POSTGRES] Could not connect to postgres", error);
      process.exit(1);
    }
  }

  async disconnect() {
    await this._client.end();
  }

  get client() {
    return this._client;
  }
}
