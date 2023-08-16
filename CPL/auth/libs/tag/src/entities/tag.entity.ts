import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class Tag extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column()
  @Expose({ name: 'name' })
  name: string

  @Column({ unique: true, name: 'unicode_name' })
  @Expose({ name: 'unicode_name' })
  unicodeName: string
}
