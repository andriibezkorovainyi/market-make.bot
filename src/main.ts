import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { exceptionFactory } from './common/serializers/exceptions'
import { AppInterceptor, SentryInterceptor } from './common/interceptors'
import { AppConfigService, AppLoggerService } from './core'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
  })

  const config = app.get(AppConfigService)

  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    maxAge: 86400, // 24 hours
    credentials: false,
  })
  app.disable('x-powered-by', 'X-Powered-By')

  if (config.sentry.enable) {
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.environment,
    })
  }

  const logger = await app.resolve(AppLoggerService)
  app.useLogger(logger)
  app.useGlobalInterceptors(app.get(AppInterceptor))
  app.useGlobalInterceptors(app.get(SentryInterceptor))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      validationError: { target: true, value: true },
      stopAtFirstError: true,
      exceptionFactory: exceptionFactory(logger),
    }),
  )

  // await app.listen(config.port)

  logger.log(`Application is running`)
  // logger.log(`Application is running on: ${await app.getUrl()}`)
}

void bootstrap()
