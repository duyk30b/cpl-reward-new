import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailCheckLog } from './entities/email-check-log.entity'
import { UserEmail } from './entities/user-email.entity'
import { EmailCheckLogService } from './services/email-check-log.service'
import { UserEmailService } from './services/user-email.service'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEmail, EmailCheckLog])],
  providers: [UserEmailService, EmailCheckLogService],
  exports: [UserEmailService, EmailCheckLogService],
})
export class UserEmailModule {}
