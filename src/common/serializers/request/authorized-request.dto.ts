import { IsDefined, IsUUID } from 'class-validator'

// extract to serializers
export class AuthorizedRequestDto {
  @IsDefined()
  @IsUUID()
  currentAccountId!: string
}

export class AuthorizedAMQPRequestDto extends AuthorizedRequestDto {
  @IsDefined()
  @IsUUID()
  currentRequestId!: string
}
