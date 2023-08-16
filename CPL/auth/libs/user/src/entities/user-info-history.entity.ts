import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import { Expose } from 'class-transformer'
import { DateColumnTransformer } from '@lib/util'

@Entity()
export class UserInfoHistory {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  firstName: string

  @Column({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  lastName: string

  @Column({ name: 'full_name' })
  @Expose({ name: 'full_name' })
  fullName: string

  @Column({ name: 'furigana_1', nullable: true })
  @Expose({ name: 'furigana_1' })
  furigana1: string

  @Column({ name: 'furigana_2', nullable: true })
  @Expose({ name: 'furigana_2' })
  furigana2: string

  @Column({ transformer: DateColumnTransformer() })
  @Expose()
  birthday: string

  @Column()
  @Expose()
  phone: string

  @Column({ name: 'phone_country' })
  @Expose({ name: 'phone_country' })
  phoneCountry: string

  @Column({ name: 'building_room', nullable: true })
  @Expose({ name: 'building_room' })
  buildingRoom: string

  @Column()
  @Expose()
  address: string

  @Column()
  @Expose()
  city: string

  @Column({ name: 'state_region' })
  @Expose({ name: 'state_region' })
  stateRegion: string

  @Column({ name: 'zip_code' })
  @Expose({ name: 'zip_code' })
  zipCode: string

  @Column({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  countryId: number

  @Column({ name: 'nationality_id' })
  @Expose({ name: 'nationality_id' })
  nationalityId: number

  @Column()
  @Expose()
  gender: number

  @Column({
    name: 'is_modified_by_user',
  })
  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: boolean

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at', default: null })
  createdAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }

  @Expose({ name: 'user_kyc_history' })
  userKycHistory
}
