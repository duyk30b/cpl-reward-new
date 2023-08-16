import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'
import { JsonNameInterface } from 'lib/reason/interfaces/json-name.interface'
import { ReasonEntity } from 'lib/reason/entities/reason.entity'

@Entity('reason_category')
export class ReasonCategoryEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Expose()
  @Column({ type: 'json' })
  name: JsonNameInterface

  @Column()
  @Expose()
  type: number

  @Expose()
  reasons?: ReasonEntity[]
}
