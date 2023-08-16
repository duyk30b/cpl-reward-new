import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'
import { JsonNameInterface } from '../interfaces/json-name.interface'
import { ReasonCategoryEntity } from './reason-category.entity'

@Entity('reason')
export class ReasonEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Expose()
  @Column({ type: 'json' })
  name: JsonNameInterface

  @Expose({ name: 'category_id' })
  @Column({ name: 'category_id' })
  categoryId: string

  @Expose({ name: 'category' })
  category?: ReasonCategoryEntity
}
