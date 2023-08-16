import { Module } from '@nestjs/common'
import { BanUserHistoryService } from './ban-user-history.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BanUserHistory } from './ban-user-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BanUserHistory])],
  providers: [BanUserHistoryService],
  exports: [BanUserHistoryService],
})
export class BanUserHistoryModule {}
