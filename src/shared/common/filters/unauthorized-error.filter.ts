import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UnauthorizedError } from '../errors';
import { Response } from 'express';

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).json({
      statusCode: 401,
      message: exception.message,
    });
  }
} 