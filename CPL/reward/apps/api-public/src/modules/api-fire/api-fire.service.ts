import { sleep } from '@lib/common'
import { KafkaProducerService } from '@lib/kafka'
import { Injectable, Logger } from '@nestjs/common'
import { ApiCampaignService } from '../api-campaign/api-campaign.service'
import { FireCheckInQuery } from './request/fire-check-in.request'
import { FireKafkaBody, FireKafkaQuery } from './request/fire-kafka.request'

@Injectable()
export class ApiFireService {
  private readonly logger = new Logger(ApiFireService.name)

  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly apiCampaignService: ApiCampaignService,
  ) {}

  async startFireKafka(query: FireKafkaQuery, body: FireKafkaBody) {
    for (let i = query.userIdStart; i <= query.userIdEnd; i++) {
      body.data.user_id = i.toString()
      this.logger.log('Start fire message kafka with userId: ' + i)
      await this.kafkaProducerService.sendMessage(query.topicName, body.data)
      await sleep(query.gap)
    }
  }

  async fireCheckIn(query: FireCheckInQuery) {
    for (let i = query.userIdStart; i <= query.userIdEnd; i++) {
      for (let j = 0; j < query.duplicate; j++) {
        this.logger.log('Start fire check-in with userId: ' + i)
        await this.apiCampaignService.startCheckIn(i.toString())
      }
      await sleep(query.gap)
    }
  }
}
