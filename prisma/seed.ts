// prisma/seed.ts
import { PrismaClient, Roles, UserStatus } from '@prisma/client';
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

  console.log(' Empresa Infraseg criado via seed');
}
async function seedUser() {
  const userData = {
    name: 'Claiver Almeida de Araújo',
    login: 'System Admin Claiver',
    password: 'SystemAdmin123@Senha',
    email: 'systemadmin@user.com',
    role: Roles.SYSTEM_ADMIN,
    profilePicture: null,
    status: UserStatus.ACTIVE,
    cpf: '021.564.766-16',
    phone: '(11) 97073-6987',
    address: 'Rua Jabuticabeira, 393',
  };

  const exists = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (exists) return;

  userData.password = await bcrypt.hash(userData.password, 10);

  await prisma.user.create({
    data: userData,
  });

  console.log(' Usuário administrador criado via seed');
}
