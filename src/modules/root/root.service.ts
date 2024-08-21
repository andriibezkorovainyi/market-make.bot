import { Injectable } from '@nestjs/common'
import { StatusDto } from '../../common/serializers/responses'

@Injectable()
export class RootService {
  getStatus(): StatusDto {
    return { status: 'ok' }
  }
}
