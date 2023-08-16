import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from '@lib/util'

@Entity()
export class MyBaseEntity {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  @TransformInt()
  createdAt: number

  @Expose({ name: 'updated_at' })
  @Column({ name: 'updated_at', default: null })
  @TransformInt()
  updatedAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date().getTime()
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date().getTime()
  }
}

@Entity()
export class BaseEntityWithCreatedAt {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  @TransformInt()
  createdAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
