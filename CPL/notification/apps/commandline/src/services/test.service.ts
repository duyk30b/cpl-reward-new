import { Logger } from '@nestjs/common'
import { Command, CommandRunner } from 'nest-commander'

@Command({ name: 'test' })
export class TestService extends CommandRunner {
  private readonly logger = new Logger(TestService.name)
  async run(passedParam: string[]): Promise<void> {
    this.logger.log('test')
  }
}
