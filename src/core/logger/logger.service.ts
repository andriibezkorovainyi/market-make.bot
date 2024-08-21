import 'winston-daily-rotate-file'
import { utilities as winstonModuleUtilities } from 'nest-winston/dist/winston.utilities'
import { Injectable, LoggerService, Scope } from '@nestjs/common'
import winston, { createLogger, Logger } from 'winston'
import { format } from 'date-fns'
import { T_GenerateMetaOptions, T_MessageType, T_Meta } from './logger.types'
import { AsyncStorageService } from '../../providers/async-storage'
import { AppConfigService } from '../config/config.service'
import { parseStack } from '../../common/helpers'

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements LoggerService {
  private context = 'AuthService'

  private static winstonLogger: Logger

  constructor(
    private readonly config: AppConfigService,
    private readonly asyncStorage: AsyncStorageService,
  ) {}

  private getLoggerInstance(): Logger {
    if (!AppLoggerService.winstonLogger) {
      const { logger: config, isLocal } = this.config

      AppLoggerService.winstonLogger = createLogger({
        levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, http: 5, silly: 6 },
        level: this.config.logger.level,
        transports: [],
      })

      if (config.transport.console) {
        AppLoggerService.winstonLogger.add(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp({ format: () => format(new Date(), 'dd/MM/yyyy HH:mm:ss') }),
              winston.format.ms(),
              winstonModuleUtilities.format.nestLike(
                `acm-${this.config.environment}:${process.pid}`,
                { prettyPrint: true },
              ),
              isLocal ? winston.format.align() : winston.format.json(),
            ),
          }),
        )
      }

      if (config.transport.file) {
        AppLoggerService.winstonLogger.add(
          new winston.transports.DailyRotateFile({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            filename: `${config.logPath}/%DATE%-error.log`,
            datePattern: config.datePattern,
            maxFiles: config.maxFiles,
            maxSize: config.maxSize,
            zippedArchive: true,
            level: 'error',
          }),
        )
        AppLoggerService.winstonLogger.add(
          new winston.transports.DailyRotateFile({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            filename: `${config.logPath}/%DATE%-combined.log`,
            datePattern: config.datePattern,
            maxFiles: config.maxFiles,
            maxSize: config.maxSize,
            zippedArchive: false,
          }),
        )
      }
    }

    return AppLoggerService.winstonLogger
  }

  static getStaticLogger() {
    if (!AppLoggerService.winstonLogger) {
      return null
    }

    return AppLoggerService.winstonLogger
  }

  public setContext(context: string): this {
    this.context = context

    return this
  }

  private generateMeta({ message, context, trace }: T_GenerateMetaOptions): T_Meta {
    const [first, ...other] = parseStack(this.generateMeta)
    const fileName =
      first && !first.getFileName()?.includes('node_modules') ? `\n\r${String(first)}}` : ''
    const stack = trace || other.map((i) => String(i))
    let meta: T_Meta = {
      message: '',
      timestamp: new Date().toISOString(),
      context: context || this.context,
      processID: process.pid,
      requestID: this.asyncStorage.getRequestID(),
      userID: this.asyncStorage.getUserID(),
    }

    if (typeof message === 'string') {
      meta = { ...meta, message }
    } else if (message instanceof Error) {
      meta = {
        ...meta,
        message: `${message?.name}: ${message?.message}`,
        stack,
      }
    } else {
      meta = { ...meta, message: '', ...message }
    }

    meta.message = `${meta.message}${fileName}`

    return meta
  }

  log(message: T_MessageType, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context })
    this.getLoggerInstance().info(logMessage, meta)

    return this
  }

  http(message: T_MessageType, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context })
    this.getLoggerInstance().http(logMessage, meta)

    return this
  }

  error(message: T_MessageType, trace?: string, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context, trace })
    this.getLoggerInstance().error(logMessage, meta)

    return this
  }

  warn(message: T_MessageType, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context })
    this.getLoggerInstance().warn(logMessage, meta)

    return this
  }

  debug(message: T_MessageType, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context })
    this.getLoggerInstance().debug(logMessage, meta)

    return this
  }

  verbose(message: T_MessageType, context?: string): this {
    const { message: logMessage, ...meta } = this.generateMeta({ message, context })
    this.getLoggerInstance().verbose(logMessage, meta)

    return this
  }
}
