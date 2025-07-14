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
    // users
    await client.query(
      `INSERT INTO users (email, pwd) VALUES ('test1@test.com', '12345')`,
    );
    await client.query(
      `INSERT INTO users (email, pwd) VALUES ('test2@test.com', '12345')`,
    );
    await client.query(
      `INSERT INTO users (email, pwd) VALUES ('test3@test.com', '12345')`,
    );
    await client.query(
      `INSERT INTO users (email, pwd) VALUES ('test4@test.com', '12345')`,
    );

    // orders
    const { rows: users } = await client.query(`SELECT * FROM users`);
    console.log(users);

    for (const user of users) {
      await client.query(
        `INSERT INTO orders (user_id, product_name, amount) VALUES (${user.id}, 'Product for ${user.id}', 10)`,
      );
    }

    console.log("!!! Seed done");
  } catch (e) {
    console.error("❌ Seed failed:", e);
  } finally {
    await client.end();
  }
});
