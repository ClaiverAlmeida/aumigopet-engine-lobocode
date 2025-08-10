import { NotFoundError, ConflictError } from '../common/errors';
import { SUCCESS_MESSAGES } from '../common/messages';
import { UniversalRepository } from '../repositories/universal.repository';

export abstract class UniversalService {
  protected readonly entityName: string;

  constructor(
    protected repository: UniversalRepository,
    entityName: string,
  ) {
    this.entityName = entityName;
  }

  async validarExistencia(id: string, deletedAt: boolean = false) {
    const company = await this.repository.buscarUnico(this.entityName, {
      id,
      deletedAt: deletedAt ? { not: null } : null,
    });

    if (!company) {
      throw new NotFoundError(this.entityName, id, 'id');
    }
    return company;
  }

  async buscarPorId(id: string) {
    return this.validarExistencia(id);
  }

  async buscarTodos(entityName: string) {
    return this.repository.buscarMuitos(this.entityName, { deletedAt: null });
  }

  async buscarComPaginacao(page: number = 1, limit: number = 10) {
    return this.repository.buscarComPaginacao(
      this.entityName,
      { deletedAt: null },
      page,
      limit,
      { name: 'asc' },
    );
  }

  async criar(data: any) {
    return this.repository.criar(this.entityName, data);
  }

  async atualizar(id: string, data: any) {
    await this.validarExistencia(id);
    return this.repository.atualizar(this.entityName, { id }, data);
  }

  async desativar(id: string) {
    await this.validarExistencia(id);

    await this.repository.desativar(this.entityName, { id });

    return {
      message: SUCCESS_MESSAGES.CRUD.DELETED,
    };
  }

  async reativar(id: string) {
    await this.validarExistencia(id, true);

    await this.repository.reativar(this.entityName, { id });

    return {
      message: SUCCESS_MESSAGES.CRUD.RESTORED,
    };
  }
}
