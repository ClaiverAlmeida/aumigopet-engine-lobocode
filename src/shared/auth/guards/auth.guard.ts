import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'; 
import { PrismaService } from '../../prisma/prisma.service';
import { CaslAbilityService } from '../../casl/casl-ability/casl-ability.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const token = this.extractTokenFromHeader(request);
      this.validateTokenExists(token);

      const payload = this.validateAndDecodeToken(token!);
      const user = await this.findAndValidateUser(payload.sub);

      this.setupUserContext(request, user);
      return true;
    } catch (error) {
      this.handleAuthenticationError(error);
    }
  }

  // Extrair token do header
  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // Validar se token existe
  private validateTokenExists(token: string | undefined): void {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
  }

  // Validar e decodificar token JWT
  private validateAndDecodeToken(token: string): ITokenPayload {
    try {
      return this.jwtService.verify<ITokenPayload>(token, {
        algorithms: ['HS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token', { cause: error });
    }
  }

  // Buscar e validar usuário no banco
  private async findAndValidateUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // Configurar contexto do usuário
  private setupUserContext(request: Request, user: any): void {
    request.user = user;
    this.abilityService.createForUser(user); // RBAC e ABAC
  }

  // Tratar erros de autenticação
  private handleAuthenticationError(error: any): never {
    console.error('Authentication error:', error);

    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException('Authentication failed');
  }

  // Método protegido para extensão (Open/Closed Principle)
  protected getTokenExtractionStrategy(): 'header' | 'cookie' | 'custom' {
    return 'header';
  }
}
