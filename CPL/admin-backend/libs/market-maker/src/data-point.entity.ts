import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({ name: 'market_maker_data_point' })
export class DataPointItem {
  @PrimaryGeneratedColumn()
  @Expose()
  id?: string

  @Expose({ name: 'coin' })
  @Column({ name: 'coin' })
  coin: string

  @Expose({ name: 'currency' })
  @Column({ name: 'currency' })
  currency: string

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at' })
  created_at: string

  @Expose({ name: 'start_time' })
  @Column({ name: 'start_time' })
  start_time: string

  @Expose({ name: 'end_time' })
  @Column({ name: 'end_time' })
  end_time: string

  @Expose({ name: 'start_price' })
  @Column({ name: 'start_price' })
  start_price: string

  @Expose({ name: 'end_price' })
  @Column({ name: 'end_price' })
  end_price: string
}
