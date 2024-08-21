import { IsDefined, IsInt, IsOptional, IsUUID, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PagedQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageNumber!: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize!: number
}

export class AuthorizedPagedDto extends PagedQueryDto {
  @IsDefined()
  @IsUUID()
  currentAccountId!: string
}
