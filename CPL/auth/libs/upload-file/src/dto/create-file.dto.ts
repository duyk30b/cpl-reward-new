import { Expose } from 'class-transformer'

export class CreateFileDto {
  @Expose()
  userId: string

  @Expose()
  host: string

  @Expose()
  name: string

  @Expose()
  metadata: string

  @Expose()
  isImage: boolean
}
