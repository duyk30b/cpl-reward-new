import { IUserPushCommand } from '@libs/redis'
import { Prop, Schema } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'
import * as mongoose from 'mongoose'

export type PushLogDocument = PushLog & mongoose.Document

@Schema({ collection: 'push_log' })
export class PushLog {
  @Expose()
  @Prop()
  pushScheduleId: string

  @Expose()
  @Prop()
  notificationId: string

  @Expose()
  @Prop()
  userId: string

  @Expose()
  @Prop()
  success: boolean

  @Expose()
  @Prop({ type: mongoose.Schema.Types.Mixed })
  response: Record<string, any>

  @Expose()
  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: IUserPushCommand

  @Expose()
  @Prop()
  error: string

  @Expose()
  @Prop()
  createdAt: number
}
