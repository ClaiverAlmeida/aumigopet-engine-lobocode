// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function runSeed() {
  await seedCompany();
  await seedUser();
}

async function seedCompany() {
  const cnpj = '26.332.986/0001-90';
  const name = 'Infraseg';
  const exists = await prisma.company.findUnique({ where: { cnpj } });
  if (exists) return;

  await prisma.company.create({
    data: {
      name,
      cnpj,
    },
  });

  console.log('✅ Empresa Infraseg criado via seed');
}
async function seedUser() {
  const email = 'platformadmin@user.com';
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return;

  const hashed = await bcrypt.hash('123456', 10);
  const role = 'PLATFORM_ADMIN';

  await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email,
      password: hashed,
      role, // Adicione o valor apropriado para profileType conforme definido no seu schema
    },
  });

  console.log('✅ Usuário administrador criado via seed');
}
