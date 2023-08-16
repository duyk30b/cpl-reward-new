import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class Channel extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column()
  @Expose({ name: 'name' })
  name: string

  @Column({ unique: true, name: 'link' })
  @Expose({ name: 'link' })
  link: string

  @Column({ unique: true, name: 'dynamic_link', default: null, nullable: true })
  @Expose({ name: 'dynamic_link' })
  dynamicLink: string

  @Column({ name: 'tag_ids' })
  @Expose({ name: 'tag_ids' })
  tagIds: string
}
