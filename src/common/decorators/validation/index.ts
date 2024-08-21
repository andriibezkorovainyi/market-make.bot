import {
  IsBoolean,
  IsString,
  Length,
  Matches,
  registerDecorator,
  ValidateIf,
  ValidationOptions,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'
import { MESSAGE, REGEX } from '../../constants'
import { TransformBooleanLike } from '../transform'
import { isValidTimeZone } from '../../helpers'

export const ValidateIfNullable = (condition: (object: any, value: any) => boolean) => {
  return applyDecorators(
    Transform(({ obj, value }) => (condition(obj, value) ? value : undefined)),
    ValidateIf(condition),
  )
}

export const IsBooleanLike = (values: any[] = [true, 'enabled', 'true', '1', 'on']) => {
  return applyDecorators(TransformBooleanLike(values), IsBoolean())
}

export const IsValidCharacters = () => {
  return applyDecorators(
    IsString(),
    Length(1, 63),
    Matches(REGEX.characters, { message: MESSAGE.characters }),
  )
}

export const IsPassword = () => {
  return applyDecorators(
    IsString(),
    Length(8, 63),
    Matches(REGEX.password, { message: MESSAGE.password }),
  )
}

export const IsEmail = () => {
  return applyDecorators(IsString(), Matches(REGEX.email, { message: MESSAGE.email }))
}

export const IsCode = () => {
  return applyDecorators(IsString(), Length(4, 4), Matches(REGEX.code, { message: MESSAGE.code }))
}

export function IsTimeZone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTimeZone',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isValidTimeZone(value)
        },
        defaultMessage(): string {
          return 'TimeZone is not valid'
        },
      },
    })
  }
}

export function IsPositiveNumberString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPositiveNumberString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Number(value) > 0
        },
        defaultMessage(): string {
          return 'Number should be positive'
        },
      },
    })
  }
}
