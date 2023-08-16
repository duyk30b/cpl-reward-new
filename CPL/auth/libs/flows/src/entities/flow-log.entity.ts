import { Expose } from 'class-transformer'
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class FlowLog extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('INDEX_FLOW_ID')
  @Expose({ name: 'flow_id' })
  @Column({ name: 'flow_id' })
  flowId: number

  @Column()
  status: number
}
