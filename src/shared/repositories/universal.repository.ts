import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Repository universal que funciona para qualquer entidade
   */
  private buscarEntidade(entityName: string) {
    return this.prisma[entityName];
  }

  /**
   * Buscar múltiplos registros
   */
  async buscarMuitos(
    entityName: string,
    where?: any,
    options?: { skip?: number; take?: number; orderBy?: any },
    include?: any,
  ): Promise<any[]> {
    return this.buscarEntidade(entityName).findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy || { createdAt: 'desc' },
      include,
    });
  }

  /**
   * Buscar com paginação
   */
  async buscarComPaginacao(
    entityName: string,
    where?: any,
    page: number = 1,
    limit: number = 10,
    orderBy?: any,
    include?: any,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.buscarMuitos(
        entityName,
        where,
        { skip, take: limit, orderBy },
        include,
      ),
      this.contarTodos(entityName, where),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar registro único
   */
  async buscarUnico(
    entityName: string,
    where: any,
    include?: any,
  ): Promise<any | null> {
    return this.buscarEntidade(entityName).findUnique({
      where,
      include,
    });
  }

  /**
   * Buscar primeiro registro que atenda aos critérios
   */
  async buscarPrimeiro(
    entityName: string,
    where: any,
    include?: any,
  ): Promise<any | null> {
    return this.buscarEntidade(entityName).findFirst({
      where,
      include,
    });
  }

  /**
   * Criar novo registro
   */
  async criar(entityName: string, data: any, include?: any): Promise<any> {
    return this.buscarEntidade(entityName).create({
      data,
      include,
    });
  }

  /**
   * Atualizar registro existente
   */
  async atualizar(
    entityName: string,
    where: any,
    data: any,
    include?: any,
  ): Promise<any> {
    return this.buscarEntidade(entityName).update({
      where,
      data,
      include,
    });
  }

  /**
   * Deletar registro
   */
  async deletar(entityName: string, where: any): Promise<any> {
    return this.buscarEntidade(entityName).delete({
      where,
    });
  }

  /**
   * Contar registros
   */
  async contarTodos(entityName: string, where?: any): Promise<number> {
    return this.buscarEntidade(entityName).count({ where });
  }

  /**
   * Verificar se existe
   */
  async existe(entityName: string, where: any): Promise<boolean> {
    const count = await this.contarTodos(entityName, where);
    return count > 0;
  }

  /**
   * Soft delete (se a entidade tiver deletedAt)
   */
  async desativar(entityName: string, where: any): Promise<any> {
    return this.buscarEntidade(entityName).update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Restaurar soft delete
   */
  async reativar(entityName: string, where: any): Promise<any> {
    return this.buscarEntidade(entityName).update({
      where,
      data: { deletedAt: null },
    });
  }

  /**
   * Upsert - criar ou atualizar
   */
  async upsert(
    entityName: string,
    where: any,
    create: any,
    update: any,
    include?: any,
  ): Promise<any> {
    return this.buscarEntidade(entityName).upsert({
      where,
      create,
      update,
      include,
    });
  }

  /**
   * Deletar muitos
   */
  async deletarMuitos(entityName: string, where: any): Promise<any> {
    return this.buscarEntidade(entityName).deleteMany({
      where,
    });
  }
}
