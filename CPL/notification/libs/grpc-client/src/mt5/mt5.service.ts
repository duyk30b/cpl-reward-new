import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class Mt5Service {
  constructor(private readonly configService: ConfigService) {}

  async getAdminEmails(): Promise<string[]> {
    return this.configService.get('mt5.admin_emails')
  }
}
