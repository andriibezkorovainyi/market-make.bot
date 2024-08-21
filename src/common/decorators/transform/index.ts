import { Transform } from 'class-transformer'

export const TransformBooleanLike = (values: any[] = [true, 'enabled', 'true', '1', 'on']) => {
  return Transform(({ obj, key }) => {
    return values.includes(obj[key])
  })
}
