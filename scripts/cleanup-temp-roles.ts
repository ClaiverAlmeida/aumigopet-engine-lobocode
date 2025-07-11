import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupTempRoles() {
  try {
    console.log('🔍 Verificando usuários com roles temporários...');
    
    // Verificar usuários com roles temporários
    const tempRoleUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['EDITOR', 'WRITER', 'READER']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true
      }
    });

    if (tempRoleUsers.length === 0) {
      console.log(' Nenhum usuário com roles temporários encontrado!');
      return;
    }

    console.log(`⚠️  Encontrados ${tempRoleUsers.length} usuários com roles temporários:`);
    tempRoleUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}): ${user.role}`);
    });

    console.log('\n🔄 Convertendo roles temporários para GUARD...');
    
    // Converter todos para GUARD (role mais comum)
    const updateResult = await prisma.user.updateMany({
      where: {
        role: {
          in: ['EDITOR', 'WRITER', 'READER']
        }
      },
      data: {
        role: 'GUARD'
      }
    });

    console.log(` ${updateResult.count} usuários convertidos para GUARD`);
    
    // Verificar se ainda há roles temporários
    const remainingTempUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['EDITOR', 'WRITER', 'READER']
        }
      }
    });

    if (remainingTempUsers.length === 0) {
      console.log(' Limpeza concluída com sucesso!');
    } else {
      console.log(`❌ Ainda há ${remainingTempUsers.length} usuários com roles temporários`);
    }

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTempRoles(); 