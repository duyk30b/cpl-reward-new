import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { ReasonService } from '@lib/grpc-client/reason/reason.service'
import { CreateReasonDto, ReasonDto } from './api-reason.dto'
import { IReasonFilter } from '@lib/grpc-client/reason/interfaces/reason.interface'

@Injectable()
export class ApiReasonService {
  private logger = new Logger(ApiReasonService.name)
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,

    private reasonService: ReasonService,
  ) {}

  async getAllReasonCategories() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.configService.get(
            'global.bce_admin_url',
          )}/api/internal/reason-categories`,
          {
            params: {
              internal_secret: this.configService.get(
                'global.bce_admin_internal_secret',
              ),
              no_pagination: 1,
            },
          },
        ),
      )
      return response.data.data
    } catch (e) {
      this.logger.error(e)
    }
  }

  async create(createReasonCategory: CreateReasonDto) {
    return await this.reasonService.create(createReasonCategory)
  }

  async findAll(reasonFilter: IReasonFilter) {
    return await this.reasonService.findAll(reasonFilter)
  }

  async findById(id: string) {
    return await this.reasonService.findById(id)
  }

  async update(reasonCategory: ReasonDto) {
    return await this.reasonService.update(reasonCategory)
  }

  async delete(id: string) {
    return await this.reasonService.delete(id)
  }
}
