import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { CoreModule } from './core/core.module'
import { AppCacheModule } from './providers/cache/cache.module'
import { SharedModule } from './shared/shared.module'
import { EndpointsModule } from './modules/endpoints.module'
import { AsyncStorageModule } from './providers/async-storage/async-storage.module'
import { BotModule } from './modules/bot/bot.module'

@Module({
  imports: [
    CoreModule,
    AppCacheModule,
    SharedModule,
    AsyncStorageModule,
    EndpointsModule,
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
      },
    }),
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
