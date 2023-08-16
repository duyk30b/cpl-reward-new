import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity({ name: 'user_setting' })
export class UserSetting {
  @PrimaryColumn()
  @Expose()
  id: string

  @Column({ name: 'exchange_tutorial_status' })
  @Expose({ name: 'exchange_tutorial_status' })
  exchangeTutorialStatus: number

  @Column({ name: 'bo_tutorial_status' })
  @Expose({ name: 'bo_tutorial_status' })
  boTutorialStatus: number
}
