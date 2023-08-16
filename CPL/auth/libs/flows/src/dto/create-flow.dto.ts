import { Expose } from 'class-transformer'

export class CreateFlowDto {
  @Expose()
  uuid: string

  @Expose()
  action: number

  @Expose()
  userId: string

  @Expose()
  status: number
}
