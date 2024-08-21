import { Injectable, OnModuleInit } from '@nestjs/common'
import { AppLoggerService } from '../../core'
import { AppCacheService } from '../../providers/cache/cache.service'

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private readonly loggerService: AppLoggerService,
    private readonly cacheService: AppCacheService,
  ) {}

  async onModuleInit() {
    this.loggerService.log('BotService initialized')
  }
}
