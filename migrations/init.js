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
    // suggect to drop all tables here to be capable to do migration several times w/o errors
    const sql = readFileSync("./migrations/init.sql", "utf-8");
    await client.query(sql);
    await client.end();

    console.log("!!! Migration done");
  } catch (e) {
    console.error("❌ Migration failed:", e);
  }
});
