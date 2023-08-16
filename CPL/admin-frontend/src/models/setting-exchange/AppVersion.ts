import { Exclude, Expose } from 'class-transformer'

export enum PlatformEnum {
  ANDROID = 'android',
  IOS = 'ios',
}

export class PlatformParams {
  platform: string
  page?: number
  size?: string
}

@Exclude()
export class PlatformItem {
  @Expose()
  platform: PlatformEnum = PlatformEnum.IOS

  @Expose()
  version: string

  @Expose()
  change_log: string

  @Expose()
  release_date: string = new Date().toISOString()

  @Expose()
  force_update: boolean
}
