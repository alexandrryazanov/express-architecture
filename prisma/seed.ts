import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await seedUser();
  await seedItems();
  await seedOrder();
}

async function seedUser() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { email: "alice@example.com", password: "111" },
      { email: "bob@example.com", password: "2222" },
      { email: "sanek@example.com", password: "3333" },
      { email: "oleg@example.com", password: "4444" },
      { email: "serega@example.com", password: "55555" },
      { email: "mihan@example.com", password: "666666" },
      { email: "vovan@example.com", password: "777777" },
      { email: "yana@example.com", password: "8888888" },
    ],
  });

  console.log("User seeding completed!");
}

async function seedItems() {
  await prisma.item.deleteMany();

  await prisma.item.createMany({
    data: [
      { name: "item1", priceInCents: 23 },
      { name: "item2", priceInCents: 3 },
      { name: "item3", priceInCents: 2 },
      { name: "item4", priceInCents: 4 },
      { name: "item5", priceInCents: 42 },
      { name: "item6", priceInCents: 777 },
    ],
  });

  console.log("Item seeding completed!");
}

async function seedOrder() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  await prisma.order.deleteMany();

  for (const user of users) {
    console.log("Creating order for usersId = ", user.id);
    await prisma.order.create({
      data: { userId: user.id },
    });
  }

  console.log("Order seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
