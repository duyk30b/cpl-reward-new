import { BeforeInsert, Column, Entity } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from '@libs/util'

@Entity()
export class BaseEntity {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at' })
  @TransformInt()
  createdAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
