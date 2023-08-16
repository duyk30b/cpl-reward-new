import { createHmac } from 'crypto'
import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SumsubWebhookMiddleware implements NestMiddleware {
  readonly logger = new Logger(SumsubWebhookMiddleware.name)

  constructor(private readonly configService: ConfigService) {}

  async use(req: RawBodyRequest<Request>, res: Response, next: () => void) {
    if (!this.checkDigest(req, this.configService.get('sumsub.webhook_secret')))
      throw new NotFoundException()
    return next()
  }

  private checkDigest(req, secret): boolean {
    try {
      const calculatedDigest = createHmac('sha1', secret)
        .update(req.rawBody)
        .digest('hex')

      return calculatedDigest === req.headers['x-payload-digest']
    } catch (e) {
      this.logger.error(e, e.stack)
      return false
    }
  }
}
