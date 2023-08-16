import { Expose } from 'class-transformer'

export class Tag {
  @Expose()
  id: number

  @Expose()
  name = ''
}
