import { Expose } from 'class-transformer'
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'

@Entity()
export class BaseEntity {
  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  createdAt: number

  @Expose({ name: 'updated_at' })
  @Column({ name: 'updated_at', default: null })
  updatedAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) this.createdAt = Math.floor(Date.now() / 1000)
    if (!this.updatedAt) this.updatedAt = Math.floor(Date.now() / 1000)
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = Math.floor(Date.now() / 1000)
  }
}
