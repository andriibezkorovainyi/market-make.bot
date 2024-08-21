import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderValuesEnum } from '../../constants'

export abstract class BaseDto {}

export enum StatusEnum {
  OK = 'ok',
  FAILURE = 'failure',
}

export class StatusDto extends BaseDto {
  static getResponse = (status: StatusEnum) => ({ status })

  static ok = () => StatusDto.getResponse(StatusEnum.OK)

  static failure = () => StatusDto.getResponse(StatusEnum.FAILURE)

  status!: string
}

export class IDDto extends BaseDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  id!: number
}
export class UUIDDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  id!: string
}
export class BasePaginatedFiltersDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  size: number = 100

  @IsOptional()
  @IsIn(['id', 'createdAt', 'updatedAt'])
  @IsString()
  orderBy: string = 'id'

  @IsOptional()
  @IsIn(Object.values(OrderValuesEnum))
  @IsString()
  order: string = OrderValuesEnum.DESC
}
export abstract class BasePaginatedDto extends BaseDto {
  total!: number

  count!: number

  abstract data: any[]
}
