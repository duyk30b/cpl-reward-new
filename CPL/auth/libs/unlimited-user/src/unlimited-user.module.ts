import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UnlimitedUser } from './entities/unlimited-user.entity'
import { UnlimitedUserService } from '.'

@Module({
  imports: [TypeOrmModule.forFeature([UnlimitedUser], 'bce')],
  providers: [UnlimitedUserService],
  exports: [UnlimitedUserService],
})
export class UnlimitedUserModule {}
