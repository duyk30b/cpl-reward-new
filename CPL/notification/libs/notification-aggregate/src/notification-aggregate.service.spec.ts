import { Test, TestingModule } from '@nestjs/testing'
import { NotificationAggregateService } from './notification-aggregate.service'

describe('NotificationAggregateService', () => {
  let service: NotificationAggregateService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationAggregateService],
    }).compile()

    service = module.get<NotificationAggregateService>(
      NotificationAggregateService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
