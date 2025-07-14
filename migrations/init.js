import { Client } from "pg";
import { readFileSync } from "fs";

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "admin",
  database: "main",
});

client.connect().then(async () => {
  try {
    const sql = readFileSync("./migrations/init.sql", "utf-8");
    await client.query(sql);
    await client.end();

    console.log("!!! Migration done");
  } catch (e) {
    console.error("❌ Migration failed:", e);
  }
});
