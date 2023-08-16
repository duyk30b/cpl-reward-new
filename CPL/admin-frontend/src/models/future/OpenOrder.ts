import { Exclude, Expose } from 'class-transformer'

/**
 * New class
 */
@Exclude()
export class Order {
  @Expose()
  id: string

  @Expose()
  price: string

  @Expose()
  volume: string

  @Expose()
  leverage: number

  @Expose()
  side: number

  @Expose()
  type: number

  @Expose()
  status: number

  @Expose()
  user_type: number

  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  addition_margin: string

  @Expose()
  margin: string

  @Expose()
  fee: string

  @Expose()
  collateral: string

  @Expose()
  user_id: string

  @Expose()
  mode: number

  @Expose()
  position_id: string

  @Expose()
  create_time: string

  @Expose()
  update_time: string
}
/**
 * End new class
 */
