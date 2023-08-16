import { Repository, DeepPartial } from 'typeorm'
import { Logger } from '@nestjs/common'
import { QueryException } from '@app/common'

export class BaseRepository<T> extends Repository<T> {
  protected readonly logger = new Logger(BaseRepository.name)

  async createEntity(inputs: DeepPartial<T>): Promise<boolean> {
    try {
      await this.save(inputs)

      return true
    } catch (err) {
      this.logger.error(err)

      throw new QueryException()
    }
  }
}
