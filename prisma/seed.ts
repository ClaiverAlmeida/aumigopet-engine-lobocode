// prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  UserStatus,
  PetSpecies,
  PetGender,
  ServiceCategory,
  ServiceProviderStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // 1. Criar usuários
    const adminUser = await seedAdminUser();
    const regularUser = await seedRegularUser();
    const providerUser = await seedProviderUser();

    // 2. Criar pets de exemplo
    await seedPets(regularUser.id);

    // 3. Criar prestadores de serviço
    await seedServiceProviders(providerUser.id);

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  }
}

// ===============================================
// 👥 SEED DE USUÁRIOS
// ===============================================

async function seedAdminUser() {
  const email = 'admin@aumigopet.com';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('ℹ️  Usuário admin já existe');
    return exists;
  }

  const hashedPassword = await bcrypt.hash('Admin123@', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Administrador do Sistema',
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '(11) 99999-9999',
      cpf: '000.000.000-00',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  console.log('✅ Usuário admin criado:', email);
  return user;
}

async function seedRegularUser() {
  const email = 'user@aumigopet.com';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('ℹ️  Usuário regular já existe');
    return exists;
  }

  const hashedPassword = await bcrypt.hash('User123@', 10);

  const user = await prisma.user.create({
    data: {
      name: 'João Silva',
      email,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      phone: '(11) 98888-8888',
      cpf: '111.111.111-11',
      city: 'São Paulo',
      state: 'SP',
      address: 'Rua das Flores, 123',
      zipCode: '01234-567',
    },
  });

  console.log('✅ Usuário regular criado:', email);
  return user;
}

async function seedProviderUser() {
  const email = 'provider@aumigopet.com';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('ℹ️  Usuário prestador já existe');
    return exists;
  }

  const hashedPassword = await bcrypt.hash('Provider123@', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Dr. Carlos Veterinário',
      email,
      password: hashedPassword,
      role: UserRole.SERVICE_PROVIDER,
    status: UserStatus.ACTIVE,
      phone: '(11) 97777-7777',
      cpf: '222.222.222-22',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  console.log('✅ Usuário prestador criado:', email);
  return user;
}

// ===============================================
// 🐾 SEED DE PETS
// ===============================================

async function seedPets(ownerId: string) {
  const pets = [
    {
      name: 'Rex',
      species: PetSpecies.DOG,
      breed: 'Golden Retriever',
      gender: PetGender.MALE,
      birthDate: new Date('2020-05-15'),
      weight: 32.5,
      color: 'Dourado',
      idealWeightMin: 29.0,
      idealWeightMax: 34.0,
      ownerId,
    },
    {
      name: 'Luna',
      species: PetSpecies.CAT,
      breed: 'Siamês',
      gender: PetGender.FEMALE,
      birthDate: new Date('2021-08-20'),
      weight: 4.2,
      color: 'Branco e Preto',
      idealWeightMin: 3.5,
      idealWeightMax: 5.0,
      ownerId,
    },
    {
      name: 'Bob',
      species: PetSpecies.DOG,
      breed: 'Vira-lata',
      gender: PetGender.MALE,
      birthDate: new Date('2019-03-10'),
      weight: 15.0,
      color: 'Caramelo',
      idealWeightMin: 12.0,
      idealWeightMax: 18.0,
      ownerId,
    },
  ];

  for (const petData of pets) {
    const exists = await prisma.pet.findFirst({
      where: {
        name: petData.name,
        ownerId: petData.ownerId,
      },
    });

    if (!exists) {
      await prisma.pet.create({ data: petData });
      console.log(`✅ Pet criado: ${petData.name}`);
    } else {
      console.log(`ℹ️  Pet já existe: ${petData.name}`);
    }
  }
}

// ===============================================
// 🏪 SEED DE PRESTADORES DE SERVIÇO
// ===============================================

async function seedServiceProviders(ownerId: string) {
  const providers = [
    {
      name: 'Clínica Veterinária Pet Saúde',
      category: ServiceCategory.VETERINARY,
      description:
        'Clínica veterinária completa com atendimento 24h, cirurgias e exames.',
      phone: '(11) 3333-3333',
      email: 'contato@petsaude.com.br',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      latitude: -23.561684,
      longitude: -46.655981,
      status: ServiceProviderStatus.ACTIVE,
      ownerId,
      openingHours: {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-20:00',
        saturday: '08:00-14:00',
        sunday: 'Fechado',
      },
    },
    {
      name: 'Pet Shop Amigo Fiel',
      category: ServiceCategory.PET_SHOP,
      description:
        'Pet shop com ração, acessórios, brinquedos e produtos de higiene para seu pet.',
      phone: '(11) 4444-4444',
      email: 'contato@amigofiel.com.br',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01304-000',
      latitude: -23.556858,
      longitude: -46.662558,
      status: ServiceProviderStatus.ACTIVE,
      ownerId,
      openingHours: {
        monday: '09:00-19:00',
        tuesday: '09:00-19:00',
        wednesday: '09:00-19:00',
        thursday: '09:00-19:00',
        friday: '09:00-19:00',
        saturday: '09:00-17:00',
        sunday: '10:00-15:00',
      },
    },
    {
      name: 'Banho e Tosa PetStyle',
      category: ServiceCategory.GROOMING,
      description:
        'Serviços de banho, tosa, hidratação e estética para cães e gatos.',
      phone: '(11) 5555-5555',
      email: 'contato@petstyle.com.br',
      address: 'Rua Oscar Freire, 300',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426-000',
      latitude: -23.562347,
      longitude: -46.669182,
      status: ServiceProviderStatus.ACTIVE,
      ownerId,
      openingHours: {
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '08:00-16:00',
        sunday: 'Fechado',
      },
    },
    {
      name: 'Hotel Pet Paradise',
      category: ServiceCategory.HOTEL,
      description:
        'Hotel para pets com suítes individuais, playground e monitoramento 24h.',
      phone: '(11) 6666-6666',
      email: 'contato@petparadise.com.br',
      address: 'Av. Faria Lima, 2000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01452-000',
      latitude: -23.576887,
      longitude: -46.688954,
      status: ServiceProviderStatus.ACTIVE,
      ownerId,
      openingHours: {
        monday: '24 horas',
        tuesday: '24 horas',
        wednesday: '24 horas',
        thursday: '24 horas',
        friday: '24 horas',
        saturday: '24 horas',
        sunday: '24 horas',
      },
    },
    {
      name: 'Adestramento Cão Cidadão',
      category: ServiceCategory.TRAINING,
      description:
        'Adestramento profissional para cães de todas as idades e portes.',
      phone: '(11) 7777-7777',
      email: 'contato@caocidadao.com.br',
      address: 'Rua Haddock Lobo, 150',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01414-001',
      latitude: -23.564987,
      longitude: -46.666512,
      status: ServiceProviderStatus.ACTIVE,
      ownerId,
      openingHours: {
        monday: '07:00-19:00',
        tuesday: '07:00-19:00',
        wednesday: '07:00-19:00',
        thursday: '07:00-19:00',
        friday: '07:00-19:00',
        saturday: '08:00-14:00',
        sunday: 'Fechado',
      },
    },
  ];

  for (const providerData of providers) {
    const exists = await prisma.serviceProvider.findFirst({
      where: {
        name: providerData.name,
      },
    });

    if (!exists) {
      await prisma.serviceProvider.create({ data: providerData });
      console.log(`✅ Prestador criado: ${providerData.name}`);
    } else {
      console.log(`ℹ️  Prestador já existe: ${providerData.name}`);
    }
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  runSeed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
