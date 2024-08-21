import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import _ from 'lodash'
import { AppLoggerService } from '../../core'
import { AsyncStorageService } from '../../providers/async-storage'
import {
  CURRENT_REQUEST_ID,
  CURRENT_ACCOUNT_KEY,
  DEFAULT_REQUEST_ID,
  DEFAULT_USER_ID,
  InterceptorRequestEnum,
} from '../constants'

@Injectable()
export class AppInterceptor implements NestInterceptor {
  private readonly maxPayloadLength = 1000

  private readonly sensitiveFields = ['password']

  constructor(
    private readonly logger: AppLoggerService,
    private readonly asyncStorage: AsyncStorageService,
  ) {
    this.logger.setContext(AppInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    const reqType = context.getType<string>()

    let { body } = request

    if (reqType === InterceptorRequestEnum.RMQ) {
      body = request
    }

    const { method, url } = request
    const notHome = url !== '/'

    const requestId = this.getValueFromBody(body, CURRENT_REQUEST_ID, DEFAULT_REQUEST_ID)
    const userId = this.getValueFromBody(body, CURRENT_ACCOUNT_KEY, DEFAULT_USER_ID)

    this.asyncStorage.setRequestID(requestId).setUserID(userId)

    let messageData = `${requestId}. Initiated by user: ${userId}`

    if (notHome) {
      this.logger.http({
        eventType: 'start-request',
        message: `Start request with id: ${messageData}`,
        reqType,
        method,
        url,
        body: this.truncateData(this.getSafeData(body)),
      })
    }

    const startTime = performance.now()

    return next.handle().pipe(
      tap({
        next: (response) => {
          if (notHome) {
            const responseTime = performance.now() - startTime

            if (userId === DEFAULT_USER_ID && method === 'authorize-account') {
              messageData = `${requestId}. Initiated by user: ${response.id}`
            }

            this.logger.http({
              eventType: 'end-request',
              message: `End request with id: ${messageData}`,
              reqType,
              method,
              url,
              body,
              responseTime,
            })
          }
        },
        error: (error) => {
          if (notHome) {
            const responseTime = performance.now() - startTime
            this.logger.error(error, error.stack)
            this.logger.http({
              eventType: 'failed-request',
              message: `Failed request with id: ${messageData}`,
              reqType,
              method,
              url,
              body,
              responseTime,
            })
          }
        },
      }),
    )
  }

  private getValueFromBody(body: any, path: string, defaultValue: string) {
    return _.get(body, path, _.get(body, `data.${path}`, defaultValue))
  }

  private getSafeData(data: any): any {
    const filteredData = { ...data }
    this.sensitiveFields.forEach((field) => {
      if (filteredData[field]) {
        filteredData[field] = '***'
      }
    })

    return filteredData
  }

  private truncateData(data: any): any {
    const EOL = '[truncated]'

    if (typeof data === 'string' && data.length > this.maxPayloadLength) {
      return `${data.substring(0, this.maxPayloadLength)}...${EOL}`
    }

    if (typeof data === 'object') {
      const dataString = JSON.stringify(data)

      if (dataString.length > this.maxPayloadLength) {
        return `${dataString.substring(0, this.maxPayloadLength)}...${EOL}`
      }
    }

    return data
  }
}
