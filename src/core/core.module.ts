import { ConfigModule } from '@nestjs/config'
import { Global, Module } from '@nestjs/common'
import { JwtSignOptions, JwtModule } from '@nestjs/jwt'
import path from 'path'
import { I18nModule } from 'nestjs-i18n'
import { AppInterceptor, SentryInterceptor } from '../common/interceptors'
import { validate } from './config/config.validate'
import { AppConfigService } from './config/config.service'
import { AppLoggerService } from './logger/logger.service'
import { AppClassSerializerInterceptor } from '../common/serializers/responses'
import { RedlockModule } from '../common/providers'
import { AppLanguageResolver } from '../common/pipes/app-language-resolver.service'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate }),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => {
        const signOptions: JwtSignOptions = { algorithm: 'HS256' }
        if (config.isProduction) signOptions.expiresIn = config.defaultJwt.expiresIn

        return {
          secret: config.defaultJwt.secret,
          signOptions,
        }
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
      },
      loaderOptions: {
        path: path.join(__dirname, '../languages/'),
        watch: true,
      },
      resolvers: [AppLanguageResolver],
      disableMiddleware: false,
    }),
    RedlockModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        redlock: {
          retryCount: 0,
        },
        redis: {
          host: config.cacheConfig.host,
          port: config.cacheConfig.port,
          password: config.cacheConfig.password,
          db: config.cacheConfig.db,
        },
      }),
    }),
  ],
  providers: [
    AppClassSerializerInterceptor,
    AppConfigService,
    AppLoggerService,
    AppInterceptor,
    SentryInterceptor,
  ],
  exports: [
    AppClassSerializerInterceptor,
    JwtModule,
    AppConfigService,
    AppLoggerService,
    RedlockModule,
  ],
})
export class CoreModule {}
