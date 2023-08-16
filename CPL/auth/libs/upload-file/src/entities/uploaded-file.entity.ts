import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class UploadedFile {
  @PrimaryColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column()
  @Expose()
  host: string

  @Column()
  @Expose()
  name: string

  @Column()
  @Expose()
  metadata: string

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  createdAt: number

  @Column({ name: 'is_image' })
  @Expose({ name: 'is_image' })
  isImage: boolean

  @BeforeInsert()
  beforeInsert() {
    if (!this.id) {
      this.id = uuidv4()
    }
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
