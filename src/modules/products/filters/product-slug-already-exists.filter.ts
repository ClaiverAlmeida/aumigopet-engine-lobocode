import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ProductSlugAlreadyExistsError } from '../errors';
import { BaseExceptionFilter } from '../../../shared/common/filters/base-exception.filter';

@Catch(ProductSlugAlreadyExistsError)
export class ProductSlugAlreadyExistsErrorFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: ProductSlugAlreadyExistsError, host: ArgumentsHost) {
    this.sendErrorResponse(
      exception,
      host,
      HttpStatus.CONFLICT,
      'PRODUCT_SLUG_EXISTS',
      'Produto com este slug já existe',
    );
  }
}
