import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlackUser } from './entities/black-user.entity'
import { BlackUserService } from '.'

@Module({
  imports: [TypeOrmModule.forFeature([BlackUser], 'bce')],
  providers: [BlackUserService],
  exports: [BlackUserService],
})
export class BlackUserModule {}
