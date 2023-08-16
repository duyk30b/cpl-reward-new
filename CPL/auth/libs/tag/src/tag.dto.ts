import { Expose } from 'class-transformer'

export class CreateTagDto {
  @Expose()
  names: string[]
}

export class UpdateTagDto {
  @Expose()
  id: string

  @Expose()
  name: string
}

export class FindByIdsTagDto {
  @Expose()
  ids: number[]
}

export class DeleteOneTagDto {
  @Expose()
  id: number
}

export class DeleteManyTagDto {
  @Expose()
  ids: number[]
}
