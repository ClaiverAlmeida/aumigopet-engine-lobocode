import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ForbiddenError } from '../errors';
import { Response } from 'express';

@Catch(ForbiddenError)
export class ForbiddenErrorFilter implements ExceptionFilter {
  catch(exception: ForbiddenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).json({
      statusCode: 403,
      message: exception.message,
    });
  }
} 