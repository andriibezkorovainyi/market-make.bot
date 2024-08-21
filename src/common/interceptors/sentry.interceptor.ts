import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { catchError, Observable } from 'rxjs'
import * as Sentry from '@sentry/node'
import { AppConfigService, AppLoggerService } from '../../core'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly configService: AppConfigService,
  ) {
    this.logger.setContext(SentryInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        let exceptionStatus: number = HttpStatus.OK

        if (exception.response && exception.response.statusCode) {
          exceptionStatus = exception.response.statusCode
        } else if (exception.status) {
          exceptionStatus = exception.status
        } else if (exception.error && exception.error.status) {
          exceptionStatus = exception.error.status
        }

        if (
          this.configService.sentry.enable &&
          (!exceptionStatus || exceptionStatus >= HttpStatus.INTERNAL_SERVER_ERROR)
        ) {
          const request = context.switchToHttp().getRequest()

          Sentry.withScope((scope) => {
            scope.setExtras({
              ...request.body,
              method: request.url,
            })
            Sentry.captureException(exception)
          })
        }

        throw exception
      }),
    )
  }
}
