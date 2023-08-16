import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateUserKycAdminDecisionDto } from './dto/create-user-kyc-admin-decision.dto'
import { UserKycAdminDecision } from './entities/user-kyc-admin-decision.entity'

@Injectable()
export class UserKycAdminService {
  constructor(
    @InjectRepository(UserKycAdminDecision)
    private userKycAdminDecisionRepository: Repository<UserKycAdminDecision>,
  ) {}

  async saveAdminDecision(
    createUserKycAdminDecisionDto: CreateUserKycAdminDecisionDto,
  ) {
    const adminDecision = plainToClass(
      UserKycAdminDecision,
      createUserKycAdminDecisionDto,
      {
        ignoreDecorators: true,
        exposeUnsetFields: false,
      },
    )

    return await this.userKycAdminDecisionRepository.save(adminDecision)
  }

  async getListUserKycAdminDecision(userId: string) {
    return await this.userKycAdminDecisionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async countDecisionAutoReject(userId: string) {
    return await this.userKycAdminDecisionRepository.count({
      where: {
        userId,
        isAuto: true,
        status: KycStatus.REJECT,
      },
    })
  }
}
