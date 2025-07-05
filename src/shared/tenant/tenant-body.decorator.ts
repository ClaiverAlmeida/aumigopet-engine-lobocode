import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para extrair companyId do body da requisição
 * Apenas PLATFORM_ADMIN pode usar este decorator
 */
export const TenantBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.body?.companyId;
  },
); 