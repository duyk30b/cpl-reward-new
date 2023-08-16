import { JsonColumnTransformer } from '@lib/util'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'
import { IFlowData } from '../interfaces/flow-data.interface'

@Entity()
export class Flow extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('INDEX_UUID', { unique: true })
  @Column()
  uuid: string

  @Column()
  action: number

  @Expose({ name: 'user_id' })
  @Column({ nullable: true, name: 'user_id' })
  userId: string

  @Column()
  status: number

  @Expose({ name: 'flow_data' })
  @Column({
    type: 'text',
    name: 'flow_data',
    transformer: JsonColumnTransformer(),
  })
  flowData: IFlowData
}
