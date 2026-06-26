const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com")
    .trim()
    .toLowerCase();

  if (!process.env.ADMIN_LOGIN_PASSWORD) {
    throw new Error("ADMIN_LOGIN_PASSWORD must be set before creating admin.");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "admin",
      name: "Admin",
    },
    create: {
      email,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin user ready:");
  console.log({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  console.log("\nUse this login:");
  console.log("Email:", email);
  console.log("Password: ADMIN_LOGIN_PASSWORD from your environment");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
