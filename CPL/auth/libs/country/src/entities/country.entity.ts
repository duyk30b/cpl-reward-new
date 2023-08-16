import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'countries' })
export class Country extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ name: 'name' })
  @Column({ name: 'name' })
  name: string

  @Expose({ name: 'code' })
  @Column({ name: 'code' })
  code: string

  @Expose({ name: 'name_artemis' })
  @Column({ name: 'name_atermis' }) // BCE wrong field name. It is real!
  nameArtemis: string
}
