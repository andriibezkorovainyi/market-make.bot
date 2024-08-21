import { ValidationError, HttpStatus, HttpException, BadRequestException } from '@nestjs/common'
import { AppLoggerService } from '../../../core'
import { VALIDATION_ERROR_MESSAGE } from './constants'

export function exceptionFactory(logger: AppLoggerService) {
  return (errors: ValidationError[]): HttpException => {
    logger.setContext(exceptionFactory.name)
    logger.error(errors)

    return new BadRequestException({
      error: 'Bad Request',
      message: VALIDATION_ERROR_MESSAGE,
      errors: errors.map(({ target, ...err }) => err),
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }
}
