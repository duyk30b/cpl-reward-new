import { Expose } from 'class-transformer'

export class Role {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  description: string

  @Expose()
  permissions: number[] = []

  @Expose()
  screens: number[] = []
}
