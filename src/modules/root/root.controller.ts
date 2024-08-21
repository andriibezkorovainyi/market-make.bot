import { ClassSerializerInterceptor, Controller, UseInterceptors, Post, Get } from '@nestjs/common'
import { StatusDto } from '../../common/serializers/responses'
import { RootService } from './root.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get('status')
  statusGet(): StatusDto {
    return this.rootService.getStatus()
  }

  @Post('status')
  statusPost(): StatusDto {
    return this.rootService.getStatus()
  }
}
