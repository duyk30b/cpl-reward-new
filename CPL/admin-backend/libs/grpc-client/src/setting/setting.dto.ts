import { Expose, Type } from 'class-transformer'

export class CountryCodeDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  code: string

  @Expose({ name: 'name_atermis' })
  nameArtemis: string

  @Expose({ name: 'image_link' })
  imageLink: string
}

export class CountryCodeSettingDto {
  @Expose()
  @Type(() => CountryCodeDto)
  data: CountryCodeDto[]
}
