import { Expose } from 'class-transformer'

export class Country {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  code: string

  @Expose({ name: 'name_atermis' })
  nameAtermis: string

  @Expose({ name: 'image_link' })
  imageLink: string
}

export class BodyGeneric<T> {
  status: number
  data: T
}
