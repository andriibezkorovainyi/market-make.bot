import * as Sentry from '@sentry/node'
import { AppLoggerService } from '../../core'

export function sendSentryError(error: Error | string, extras: object = {}) {
  const logger = AppLoggerService.getStaticLogger()

  if (logger) {
    if (typeof error === 'string') {
      logger.error(error)
    } else {
      logger.error(error.message)
    }

    logger.error(JSON.stringify(extras))

    if (Sentry.getCurrentHub().getClient()) {
      Sentry.captureException(error, extras)
    }
  }
}

export function voidCatch(promise: Promise<any>) {
  void promise.catch(sendSentryError)
}
