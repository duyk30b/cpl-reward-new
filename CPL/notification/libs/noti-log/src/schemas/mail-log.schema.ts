import { IMailCommand } from '@libs/redis'
import { Prop, Schema } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'
import * as mongoose from 'mongoose'

export type MailLogDocument = MailLog & mongoose.Document

@Schema({ collection: 'mail_log' })
export class MailLog {
  @Expose()
  @Prop()
  email: string

  @Expose()
  @Prop()
  success: boolean

  @Expose()
  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: IMailCommand

  @Expose()
  @Prop()
  error: string

  @Expose()
  @Prop()
  createdAt: number
}
