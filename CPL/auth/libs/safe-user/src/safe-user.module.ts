import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SafeUser } from './entities/safe-user.entity'
import { SafeUserService } from './safe-user.service'

@Module({
  imports: [TypeOrmModule.forFeature([SafeUser], 'bce')],
  providers: [SafeUserService],
  exports: [SafeUserService],
})
export class SafeUserModule {}
