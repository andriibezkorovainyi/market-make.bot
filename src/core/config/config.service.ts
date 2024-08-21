import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { VALIDATED_ENV_PROPNAME } from '@nestjs/config/dist/config.constants'
import * as fs from 'fs'
import path from 'path'
import { EnvironmentEnum, EnvironmentDTO, LoggingLevelsEnum, validate } from './config.validate'

@Injectable()
export class AppConfigService extends ConfigService<EnvironmentDTO> {
  private static instance: AppConfigService

  constructor(internalConfig?: Record<string, any>) {
    super(internalConfig)

    // @ts-expect-error: @nestjs/config ALWAYS reads from process.env so this causes it to read internally
    this.getFromProcessEnv = () => undefined
  }

  static getInstance() {
    AppConfigService.instance = new AppConfigService({
      [VALIDATED_ENV_PROPNAME]: validate({ ...process.env }),
    })

    return AppConfigService.instance
  }

  get environment() {
    return <EnvironmentEnum>this.get('NODE_ENV')
  }

  get corsOrigins() {
    const originsString = <string>this.get('CORS_ORIGINS')
    const origins = originsString.split(' ').filter((e) => e !== '')

    return [this.clientRootUrl, this.apiRootUrl, ...origins]
  }

  get isTest() {
    return this.environment === EnvironmentEnum.TEST
  }

  get isLocal() {
    return this.environment === EnvironmentEnum.LOCAL
  }

  get isDevelopment() {
    return this.environment === EnvironmentEnum.DEVELOPMENT
  }

  get isProduction() {
    return this.environment === EnvironmentEnum.PRODUCTION
  }

  get isStaging() {
    return this.environment === EnvironmentEnum.STAGING
  }

  get port() {
    return <number>this.get('SYNC_ENGINE_SERVICE_PORT')
  }

  get logger() {
    return {
      level: <LoggingLevelsEnum>this.get('LOGGING_LEVEL'),
      transport: {
        console: this.isDevelopment || this.isLocal || this.isStaging || this.isProduction,
        file: this.isLocal || this.isDevelopment || this.isProduction,
      },
      datePattern: 'YYYY-MM-DD',
      maxFiles: '90d',
      maxSize: '100m',
      logPath: 'logs',
    }
  }

  get sentry() {
    return {
      dsn: <string>this.get('SENTRY_DSN'),
      enable: <boolean>this.get('ENABLE_SENTRY'),
    }
  }

  get apiRootUrl() {
    return <string>this.get('API_ROOT_URL')
  }

  get clientRootUrl() {
    return <string>this.get('CLIENT_ROOT_URL')
  }

  get appName() {
    return <string>this.get('APP_NAME')
  }

  get defaultJwt() {
    return {
      secret: <string>this.get('DEFAULT_JWT_SECRET'),
      expiresIn: <string>this.get('DEFAULT_JWT_EXPIRES'),
    }
  }

  get refreshJwt() {
    return {
      secret: <string>this.get('REFRESH_JWT_SECRET'),
      expiresIn: <string>this.get('REFRESH_JWT_EXPIRES'),
    }
  }

  // get database(): PostgresConnectionOptions {
  //   const slaveHosts = <string>this.get('DB_SLAVES')
  //   const master = this.getDbConfig(<string>this.get('DB_HOST'))
  //
  //   if (slaveHosts) {
  //     const slaves = slaveHosts.split(',').map((host) => this.getDbConfig(host))
  //
  //     return {
  //       replication: { master, slaves },
  //       logging: !this.isProduction,
  //       type: 'postgres',
  //     }
  //   }
  //
  //   return {
  //     logging: !this.isProduction,
  //     type: 'postgres',
  //     replication: { master, slaves: [master] },
  //   }
  // }

  get cacheConfig() {
    return {
      host: <string>this.get('REDIS_HOST'),
      port: <number>this.get('REDIS_PORT'),
      password: this.get<string>('REDIS_PASSWORD'),
      ttl: <number>this.get('REDIS_CACHE_TTL'),
      db: <number>this.get('REDIS_DB'),
    }
  }

  get mail() {
    return {
      from: <string>this.get('MAIL_FROM'),
      support: this.get<string>('SUPPORT_EMAIL'),
      throttleTime: <number>this.get('MAIL_THROTTLE_TIME'),
    }
  }

  get mailgun() {
    return {
      mailgunApiKey: <string>this.get('MAILGUN_API_KEY'),
      mailgunDomain: <string>this.get('MAILGUN_DOMAIN'),
      mailgunHost: <string>this.get('MAILGUN_HOST'),
      mailgunFromEmail: <string>this.get('MAILGUN_FROM_EMAIL'),
    }
  }

  get aws() {
    return {
      awsAccessKey: <string>this.get('AWS_ACCESS_KEY_ID'),
      awsSecretKey: <string>this.get('AWS_SECRET_ACCESS_KEY'),
      awsRegion: <string>this.get('AWS_REGION'),
    }
  }

  get rabbitMq() {
    return {
      username: <string>this.get('RABBITMQ_USER'),
      password: <string>this.get('RABBITMQ_PASSWORD'),
      host: <string>this.get('RABBITMQ_HOST'),
      port: <string>this.get('RABBITMQ_PORT'),
      protocol: <string>this.get('RABBITMQ_PROTOCOL'),
    }
  }

  // private getDbConfig(host: string): PostgresConnectionCredentialsOptions {
  //   const masterConfig = {
  //     host: <string>this.get('DB_HOST'),
  //     port: <number>this.get('DB_PORT'),
  //     username: <string>this.get('DB_USERNAME'),
  //     password: <string>this.get('DB_PASSWORD'),
  //     database: <string>this.get('DB_DATABASE'),
  //     ...this.getDbSecureOptions(<boolean>this.get('DB_SSL')),
  //   }
  //
  //   try {
  //     const url = new URL(`http://${host}`)
  //     const ssl = url.searchParams.get('ssl')
  //
  //     return {
  //       host: url.hostname || masterConfig.host,
  //       port: url.port ? +url.port : masterConfig.port,
  //       username: url.username || masterConfig.username,
  //       password: url.password || masterConfig.password,
  //       database: url.searchParams.get('database') || masterConfig.database,
  //       ...this.getDbSecureOptions(ssl ? ssl === 'true' : <boolean>this.get('DB_SSL')),
  //     }
  //   } catch {
  //     return masterConfig
  //   }
  // }

  private getDbSecureOptions(ssl: boolean) {
    return (
      ssl && {
        ssl: {
          rejectUnauthorized: true,
          ca: fs
            .readFileSync(path.resolve(process.cwd(), 'src/etc', 'eu-central-1-bundle.pem'))
            .toString(),
        },
        extra: {
          ssl: true,
        },
      }
    )
  }
}
