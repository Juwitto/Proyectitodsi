import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const tenant = await prisma.tenant.create({
    data: { name: 'Tenant Demo' },
  });

  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Admin Demo',
      role: 'admin',
      tenantId: tenant.id,
    },
  });
}

main()
  .then(() => console.log('Seed ejecutado correctamente'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });