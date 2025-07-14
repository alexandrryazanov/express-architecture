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
    await this.client.connect();
  }

  async disconnect() {
    await this._client.end();
  }

  get client() {
    return this._client;
  }
}
