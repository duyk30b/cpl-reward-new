import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

@Exclude()
export class DataPointItem {
  @Expose()
  id?: string

  @Expose({ name: 'coin' })
  coin: string

  @Expose({ name: 'currency' })
  currency: string

  @Expose({ name: 'created_at' })
  created_at: string

  @Expose({ name: 'start_time' })
  start_time: string

  @Expose({ name: 'end_time' })
  end_time: string

  @Expose({ name: 'start_price' })
  start_price: string

  @Expose({ name: 'end_price' })
  end_price: string
}

@Exclude()
export class GetDataPointParams {
  @Expose({ name: 'coin' })
  @IsNotEmpty()
  @IsString()
  coin: string

  @Expose({ name: 'currency' })
  @IsNotEmpty()
  @IsString()
  currency: string

  @Expose({ name: 'start_time' })
  @IsNotEmpty()
  @IsString()
  startTime: string

  @Expose({ name: 'end_time' })
  @IsNotEmpty()
  @IsString()
  endTime: string
}

@Exclude()
export class DataPointItemRes {
  @Expose({ name: 'coin' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  coin: string

  @Expose({ name: 'currency' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  currency: string

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'start_time' })
  startTime: string

  @Expose({ name: 'end_time' })
  endTime: string

  @Expose({ name: 'start_price' })
  startPrice: string

  @Expose({ name: 'end_price' })
  endPrice: string
}

@Exclude()
export class DataPointResponse {
  @Expose({ name: 'version' })
  version: string

  @Expose({ name: 'data_point' })
  @Type(() => DataPointItemRes)
  @ValidateNested({ each: true })
  data_point: DataPointItemRes[]
}

@Exclude()
export class DeleteDataPointParams {
  @Expose({ name: 'coin' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  coin: string

  @Expose({ name: 'currency' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  currency: string
}
