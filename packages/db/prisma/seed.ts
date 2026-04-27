import { PrismaClient } from "../generated";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seeding do Core...");

  const adminEmail = "admin@core.dev";
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`\n✨ SEED FINALIZADO COM SUCESSO!`);
  console.log(`👤 Admin: ${adminEmail} / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
