import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from '../errors';
import { Response } from 'express';

@Catch(ValidationError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
} 