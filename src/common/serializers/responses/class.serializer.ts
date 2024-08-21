import { ClassSerializerInterceptor, PlainLiteralObject } from '@nestjs/common'
import { ClassTransformOptions } from 'class-transformer'

export class AppClassSerializerInterceptor extends ClassSerializerInterceptor {
  private static prepareResponse(
    response: PlainLiteralObject | PlainLiteralObject[] | any,
  ): PlainLiteralObject | PlainLiteralObject[] | any {
    // TODO Serialize
    return response
  }

  serialize(
    response: PlainLiteralObject | PlainLiteralObject[],
    options: ClassTransformOptions,
  ): PlainLiteralObject | PlainLiteralObject[] {
    return super.serialize(AppClassSerializerInterceptor.prepareResponse(response), options)
  }
}
