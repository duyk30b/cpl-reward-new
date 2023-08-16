import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude, Expose, Type } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'
import { RoleEntity } from '@lib/role-permission/entities/role.entity'

@Entity({ name: 'user' })
export class Admin extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column()
  @Expose()
  name: string

  @Column({ nullable: false })
  @Expose()
  email: string

  @Column({ nullable: true, select: false })
  @Exclude()
  password: string

  @Column({ nullable: false, select: false })
  @Exclude()
  salt: string

  @Column({ name: 'otp_secret' })
  @Exclude()
  otpSecret: string

  @Exclude()
  @Column({ nullable: false, name: 'authenticator_code', select: false })
  authenticatorCode: string

  @Expose({ name: 'is_root' })
  @Column({ name: 'is_root' })
  isRoot: boolean

  @Expose({ name: 'is_first_login' })
  @Column({ name: 'is_first_login' })
  isFirstLogin: boolean

  @Expose()
  permissions: number[]

  @Expose({ name: 'direct_permissions' })
  directPermissions: number[]

  @Expose()
  screens: number[]

  @Expose({ name: 'direct_screens' })
  directScreens: number[]

  @Expose()
  roles: string[]

  @Expose({ name: 'role_entities' })
  @Type(() => RoleEntity)
  roleEntities: RoleEntity[]
}
