import { BaseEntityWithCreatedAt } from '@lib/util'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user_provider' })
export class UserProvider extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'provider_type' })
  @Expose({ name: 'provider_type' })
  providerType: string

  @Column({ name: 'provider_id' })
  @Expose({ name: 'provider_id' })
  providerId: string

  @Column({ name: 'provider_email', nullable: true })
  @Expose({ name: 'provider_email' })
  providerEmail: string
}
