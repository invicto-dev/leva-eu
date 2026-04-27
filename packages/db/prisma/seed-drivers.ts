import { PrismaClient } from '@leva-eu/db/generated/index.js';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);
  
  const driverUser = await prisma.user.upsert({
    where: { email: 'motorista@teste.com' },
    update: {},
    create: {
      email: 'motorista@teste.com',
      name: 'João Motorista',
      password,
      role: 'DRIVER',
      driver: {
        create: {
          vehicle: 'Fiat Uno',
          plate: 'ABC-1234',
          isOnline: true,
        }
      }
    }
  });

  console.log('Driver created:', driverUser.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
