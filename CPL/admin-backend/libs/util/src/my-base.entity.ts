import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from '@lib/util'

@Entity()
export class MyBaseEntity {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', type: 'bigint', default: null })
  @TransformInt()
  createdAt: string

  @Expose({ name: 'updated_at' })
  @Column({ name: 'updated_at', type: 'bigint', default: null })
  @TransformInt()
  updatedAt: string

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime().toString()
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date().getTime().toString()
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date().getTime().toString()
  }
}
