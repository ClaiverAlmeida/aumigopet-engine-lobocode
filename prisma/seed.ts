// prisma/seed.ts
import {
  PermissionType,
  PrismaClient,
  Roles,
  UserStatus,
  VehicleType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function runSeed() {
  // await clearExistingData();

  const company = await seedCompany();
  await seedPost(company.id);
  await seedVehicle(company.id);
  await seedUser(company.id);
}

async function seedCompany() {
  const cnpj = '26.332.986/0001-90';
  const name = 'LoboCode';
  const exists = await prisma.company.findUnique({ where: { cnpj } });
  if (exists) return exists;

  const company = await prisma.company.create({
    data: {
      name,
      cnpj,
    },
  });

  console.log(' Empresa LoboCode criado via seed'); 
  return company;
}

async function seedPost(companyId: string) {
  const postData = {
    name: 'Fake Posto',
    address: 'Rua Fake, 393',
    companyId,
  };

  const exists = await prisma.post.findFirst({
    where: { name: postData.name },
  });

  if (exists) return;

  await prisma.post.create({
    data: {
      ...postData,
    },
  });
}

async function seedVehicle(companyId: string) {
  const vehicleData = {
    model: 'GSR 150I',
    companyId,
    plate: 'FTC7E96',
    type: VehicleType.MOTORCYCLE,
    initialKm: 102000,
    currentKm: 102000,
  };

  const exists = await prisma.vehicle.findFirst({
    where: { model: vehicleData.model },
  });

  if (exists) return;

  await prisma.vehicle.create({
    data: vehicleData,
  });
}

async function seedUser(companyId: string) {
  const userSystemAdminData = {
    name: 'Admin Claiver Almeida de Araújo',
    login: 'System Admin Claiver',
    password: 'SystemAdmin123@Senha',
    email: 'systemadmin@user.com',
    role: Roles.SYSTEM_ADMIN,
    profilePicture: null,
    status: UserStatus.ACTIVE,
    cpf: '021.564.766-16',
    rg: '680299506',
    phone: '(11) 97073-6987',
    address: 'Rua Jabuticabeira, 393',
  };

  const existsSystemAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: userSystemAdminData.email },
        { rg: userSystemAdminData.rg },
      ],
    },
  });

  if (!existsSystemAdmin) {
    userSystemAdminData.password = await bcrypt.hash(
      userSystemAdminData.password,
      10,
    );
    await prisma.user.create({
      data: userSystemAdminData,
    });
    console.log(' Usuário sytem admin criado via seed');
  }

  const userGuardData = {
    name: 'Guarda Claiver Almeida de Araújo',
    login: 'Guarda Claiver',
    password: 'SystemAdmin123@Senha',
    email: 'guard@user.com',
    role: Roles.GUARD,
    profilePicture: null,
    status: UserStatus.ACTIVE,
    cpf: '270.204.300-31',
    rg: '1234567890',
    phone: '(11) 97073-6987',
    address: 'Rua Jabuticabeira, 393',
    companyId,
  };

  const existsGuard = await prisma.user.findFirst({
    where: {
      OR: [{ email: userGuardData.email }, { rg: userGuardData.rg }],
    },
  });
  if (!existsGuard) {
    userGuardData.password = await bcrypt.hash(userGuardData.password, 10);

    await prisma.user.create({
      data: {
        ...userGuardData,
        permissions: {
          create: [
            { permissionType: PermissionType.DOORMAN },
            { permissionType: PermissionType.PATROL },
            { permissionType: PermissionType.SUPPORT },
          ],
        },
      },
    });
    console.log(' Usuário guarda criado via seed');
  }
}
