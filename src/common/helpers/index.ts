import { InternalServerErrorException } from '@nestjs/common'
import CallSite = NodeJS.CallSite

export function parseStack(belowFn?: (...a: any[]) => any, depth: number = 0): CallSite[] {
  const oldLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 7

  const dummyObject: { stack: CallSite[] } = { stack: [] }

  const v8Handler = Error.prepareStackTrace

  Error.prepareStackTrace = (err, v8StackTrace): CallSite[] => {
    return v8StackTrace || []
  }

  Error.captureStackTrace(dummyObject, belowFn || parseStack)

  let v8StackTrace = dummyObject.stack || []
  const localDepth = depth > v8StackTrace.length - 2 ? v8StackTrace.length - 2 : depth
  v8StackTrace = v8StackTrace.slice(localDepth + 1)
  Error.prepareStackTrace = v8Handler
  Error.stackTraceLimit = oldLimit

  return v8StackTrace
}

export function getCaller() {
  const [first] = parseStack(getCaller)
  const functionName = first?.getFunctionName()

  if (!functionName) {
    throw new Error("Can't get Caller")
  }

  return functionName
}

export function isUUID(string: string) {
  const pattern = /^[0-9A-F]{8}-?[0-9A-F]{4}-?[0-9A-F]{4}-?[0-9A-F]{4}-?[0-9A-F]{12}$/i

  return pattern.test(string)
}

export function inverseRecord<T extends string, E extends string>(
  record: Record<T, E>,
): Record<E, T> {
  const invertedRecord: Record<string, T> = {}
  Object.entries(record).forEach((data) => {
    const [key, value] = data
    invertedRecord[value as E] = key as T
  })

  return invertedRecord
}

export function randomFixedInteger(length: number): number {
  return Math.floor(10 ** (length - 1) + Math.random() * (10 ** length - 10 ** (length - 1) - 1))
}

export function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new InternalServerErrorException('Time zones are not available in this environment')
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz })

    return true
  } catch (ex) {
    return false
  }
}

export function timestampFromDate(date: Date) {
  // eslint-disable-next-line no-bitwise
  return (date.valueOf() / 1000) | 0
}

export function numDigitsAfterDecimal(num: string) {
  const afterDecimalStr = num.split('.')[1] || ''

  return afterDecimalStr.length
}

export function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
    .join(' ')
}
