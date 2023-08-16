import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({ name: 'market_maker_settings' })
@Unique(['coin', 'currency', 'property_key'])
export class MarketMakerSettingItem {
  @PrimaryGeneratedColumn()
  @Expose()
  id?: string

  @Expose({ name: 'coin' })
  @Column({ name: 'coin' })
  coin: string

  @Expose({ name: 'currency' })
  @Column({ name: 'currency' })
  currency: string

  @Expose({ name: 'updated_at' })
  @Column({ name: 'updated_at' })
  updated_at: string

  @Expose({ name: 'property_key' })
  @Column({ name: 'property_key' })
  property_key: string

  @Expose({ name: 'property_value' })
  @Column({ name: 'property_value' })
  property_value: string
}
