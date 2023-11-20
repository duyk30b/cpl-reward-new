import { KafkaModule } from '@lib/kafka'
import { Module } from '@nestjs/common'
import { ApiCampaignModule } from '../api-campaign/api-campaign.module'
import { ApiFireController } from './api-fire.controller'
import { ApiFireService } from './api-fire.service'

@Module({
  imports: [KafkaModule.register('api-public'), ApiCampaignModule],
  controllers: [ApiFireController],
  providers: [ApiFireService],
})
export class ApiFireModule {}
