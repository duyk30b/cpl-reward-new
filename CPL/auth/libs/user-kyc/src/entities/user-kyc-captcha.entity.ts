import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'
import { Expose } from 'class-transformer'

@Entity()
export class UserKycCaptcha extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column()
  @Expose()
  captcha: string
}
