import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AdminActionLog } from '@lib/admin-action-log/entities/admin-action-log.entity'
import { Repository } from 'typeorm'
import { CreateAdminActionLogDto } from '@lib/admin-action-log/dto/create-admin-action-log.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class AdminActionLogService {
  constructor(
    @InjectRepository(AdminActionLog)
    private adminActionLogRepository: Repository<AdminActionLog>,
  ) {}

  async create(
    createAdminActionLogDto: CreateAdminActionLogDto,
  ): Promise<AdminActionLog> {
    const adminActionLog = plainToInstance(
      AdminActionLog,
      createAdminActionLogDto,
      {
        ignoreDecorators: true,
      },
    )

    return await this.adminActionLogRepository.save(adminActionLog)
  }
}
