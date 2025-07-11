import { Injectable } from '@nestjs/common'; 
import { NotFoundError, ValidationError } from 'src/shared/common/errors';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async validateExists(id: string) {
    const post = await this.getById(id);
    if (!post) {
      throw new NotFoundError('Post', id, 'id');
    }
    return post;
  }

  async validateBelongsToCompany(postId: string, companyId: string) {
    const post = await this.getById(postId);
    if (!post) {
      throw new NotFoundError('Post', postId, 'id');
    }
    if (post.companyId !== companyId) {
      throw new ValidationError('Post does not belong to the specified company');
    }
    return post;
  }

  // Adicione outros métodos conforme necessário
} 