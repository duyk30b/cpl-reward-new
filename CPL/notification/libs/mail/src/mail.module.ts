import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import mailConfig from './mail.config'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailConfig)],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get('mail.host'),
            port: config.get('mail.port'),
            auth: {
              user: config.get('mail.user'),
              pass: config.get('mail.password'),
            },
          },
          defaults: {
            from: `"${config.get('mail.name')}" <${config.get('mail.from')}>`,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
