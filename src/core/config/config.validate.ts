import { plainToInstance } from 'class-transformer'
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator'
import { IsBooleanLike } from '../../common/decorators/validation'

export enum EnvironmentEnum {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
  TEST = 'test',
}

export enum LoggingLevelsEnum {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export class EnvironmentDTO {
  // Server
  @IsDefined()
  @IsEnum(EnvironmentEnum)
  NODE_ENV: EnvironmentEnum = EnvironmentEnum.LOCAL

  @IsDefined()
  @IsNumberString()
  SYNC_ENGINE_SERVICE_PORT = 5006

  @IsDefined()
  @IsEnum(LoggingLevelsEnum)
  LOGGING_LEVEL: LoggingLevelsEnum = LoggingLevelsEnum.HTTP

  @IsDefined()
  @IsUrl({ require_tld: false })
  API_ROOT_URL: string = 'http://localhost:5000'

  @IsDefined()
  @IsUrl({ require_tld: false })
  CLIENT_ROOT_URL: string = 'http://localhost:5000'

  @IsDefined()
  @IsString()
  CORS_ORIGINS = ''

  @IsDefined()
  @IsString()
  APP_NAME: string = 'ACM'

  // Auth
  @IsDefined()
  @IsString()
  DEFAULT_JWT_SECRET: string = 'DEFAULT_JWT_SECRET'

  @IsDefined()
  @IsString()
  DEFAULT_JWT_EXPIRES: string = '4 hours'

  @IsDefined()
  @IsString()
  REFRESH_JWT_SECRET: string = 'REFRESH_JWT_SECRET'

  @IsDefined()
  @IsString()
  REFRESH_JWT_EXPIRES: string = '21 days'

  // ## DATABASE ##
  // MASTER
  @IsDefined()
  @IsString()
  DB_HOST!: string

  @IsDefined()
  @IsNumber()
  DB_PORT!: number

  @IsDefined()
  @IsString()
  DB_DATABASE!: string

  @IsDefined()
  @IsString()
  DB_USERNAME!: string

  @IsDefined()
  @IsString()
  DB_PASSWORD!: string

  @IsDefined()
  @IsBooleanLike()
  DB_SSL: boolean = false

  // SLAVES
  @IsOptional()
  @IsString()
  DB_SLAVES?: string

  // ## REDIS ##
  @IsDefined()
  @IsString()
  REDIS_HOST: string = 'localhost'

  @IsDefined()
  @IsNumber()
  REDIS_PORT: number = 6379

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string

  @IsDefined()
  @IsNumber()
  REDIS_DB: number = 0

  @IsDefined()
  @IsNumber()
  REDIS_CACHE_TTL: number = 3600 // In Seconds

  // MAIL
  @IsDefined()
  @IsString()
  MAIL_FROM!: string

  @IsOptional()
  @IsString()
  SUPPORT_EMAIL?: string

  @IsDefined()
  @IsNumber()
  MAIL_THROTTLE_TIME: number = 1 // In minutes

  // AWS
  @IsDefined()
  @IsString()
  AWS_REGION!: string

  @IsDefined()
  @IsString()
  AWS_ACCESS_KEY_ID!: string

  @IsDefined()
  @IsString()
  AWS_SECRET_ACCESS_KEY!: string

  // SENTRY
  @IsDefined()
  @IsBooleanLike()
  ENABLE_SENTRY: boolean = true

  @IsDefined()
  @IsUrl({ require_tld: false })
  SENTRY_DSN!: string

  // RABBITMQ
  @IsDefined()
  @IsString()
  RABBITMQ_USER!: string

  @IsDefined()
  @IsString()
  RABBITMQ_PASSWORD!: string

  @IsDefined()
  @IsString()
  RABBITMQ_HOST!: string

  @IsDefined()
  @IsString()
  RABBITMQ_PORT!: string

  @IsDefined()
  @IsString()
  RABBITMQ_PROTOCOL!: string

  @IsDefined()
  @IsString()
  MAILGUN_API_KEY!: string

  @IsDefined()
  @IsString()
  MAILGUN_DOMAIN!: string

  @IsDefined()
  @IsString()
  MAILGUN_HOST!: string

  @IsDefined()
  @IsString()
  MAILGUN_FROM_EMAIL!: string
}

export function validate(config: Record<string, unknown>): EnvironmentDTO {
  const validatedConfig = plainToInstance(EnvironmentDTO, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    whitelist: true,
    forbidUnknownValues: true,
    validationError: {
      target: false,
    },
  })

  if (errors.length > 0) {
    throw new Error(String(errors))
  }

  return validatedConfig
}
