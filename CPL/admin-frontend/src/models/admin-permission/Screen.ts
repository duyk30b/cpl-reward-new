import { Expose } from 'class-transformer'

export class ScreenDto {
  @Expose()
  id: number

  @Expose()
  module: string
}
