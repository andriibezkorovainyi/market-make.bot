import { HttpException, HttpStatus } from '@nestjs/common'

export class BaseService {
  protected throwHttpException(message: string, status: HttpStatus): never {
    throw new HttpException(message, status)
  }

  protected throwAccountNotFound(): never {
    this.throwHttpException('errors.notFound.notFoundAccount', HttpStatus.NOT_FOUND)
  }
}
