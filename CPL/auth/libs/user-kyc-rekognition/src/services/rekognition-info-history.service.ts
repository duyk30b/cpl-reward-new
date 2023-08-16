import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  DuplicateStatus,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { escapeLikeChars, formatPaginate, getFaceFile } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import {
  IPaginationOptions,
  paginateRaw,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Brackets, Connection, In, Not, Repository } from 'typeorm'
import { RekognitionInfoHistoryWithUserInfo } from '../dto/rekognition-info-history.dto'
import { RekognitionInfoHistory } from '../entities'
import { IFindRekognitionInfoHistoryWithUserInfoFilter } from '../interfaces/rekognition-info-history.interface'

@Injectable()
export class RekognitionInfoHistoryService {
  constructor(
    @InjectRepository(RekognitionInfoHistory)
    private readonly rekognitionInfoHistoryRepository: Repository<RekognitionInfoHistory>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async createRekognitionInfoHistoryForKyc(userKyc: UserKyc) {
    const existed = await this.rekognitionInfoHistoryRepository.findOne({
      userKycHistoryId: userKyc.userKycHistoryId,
    })
    if (existed) return existed
    const info = new RekognitionInfoHistory()
    info.userId = userKyc.userId
    info.userKycHistoryId = userKyc.userKycHistoryId
    info.image = getFaceFile(userKyc)?.name
    return await this.rekognitionInfoHistoryRepository.save(info)
  }

  async updateCompareStatusForKyc(userKyc: UserKyc, status: CompareStatus) {
    await this.rekognitionInfoHistoryRepository.update(
      { userKycHistoryId: userKyc.userKycHistoryId },
      { compareStatus: status },
    )
  }

  async updateFaceIdForKyc(userKyc: UserKyc, faceId: string) {
    await this.rekognitionInfoHistoryRepository.update(
      { userKycHistoryId: userKyc.userKycHistoryId },
      { faceId },
    )
  }

  async updateDuplicateStatusForKycHistory(
    userKycHistoryId: string,
    status: DuplicateStatus,
  ) {
    await this.rekognitionInfoHistoryRepository.update(
      { userKycHistoryId: userKycHistoryId },
      { duplicateStatus: status },
    )
  }

  async findRelatedInfosGroupByFaceId(
    faceIds: string[],
    exceptInfoId?: string,
    maxRecords?: number,
  ) {
    const query = this.rekognitionInfoHistoryRepository.createQueryBuilder()
    query.where({ faceId: In(faceIds) })
    if (exceptInfoId) query.andWhere({ id: Not(exceptInfoId) })
    query.groupBy('face_id')
    if (maxRecords) query.limit(maxRecords)
    return await query.getMany()
  }

  async findByKycHistoryId(userKycHistoryId: string) {
    return await this.rekognitionInfoHistoryRepository.findOne({
      userKycHistoryId,
    })
  }

  async findByIds(ids: string[]) {
    return await this.rekognitionInfoHistoryRepository.find({
      id: In(ids),
    })
  }

  async findByFaceId(faceId: string, exceptUserId: string) {
    return await this.rekognitionInfoHistoryRepository.find({
      faceId: faceId,
      userId: Not(exceptUserId),
    })
  }

  async findOneByFaceId(faceId: string, exceptUserId: string) {
    return await this.rekognitionInfoHistoryRepository.findOne({
      faceId: faceId,
      userId: Not(exceptUserId),
    })
  }

  async findOneByFaceIds(faceIds: string[], exceptUserId: string) {
    return await this.rekognitionInfoHistoryRepository.findOne({
      faceId: In(faceIds),
      userId: Not(exceptUserId),
    })
  }

  async findHistoryWithUserInfo(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    const query = this.buildFindHistoryWithUserInfoQuery(filter)

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.limit || 25,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginateRaw(query, options))
    return {
      ...result,
      data: result.data.map((item) =>
        plainToClass(RekognitionInfoHistoryWithUserInfo, item),
      ),
    }
  }

  private buildFindHistoryWithUserInfoQuery(
    filter: IFindRekognitionInfoHistoryWithUserInfoFilter,
  ) {
    const SORT_FIELD_MAP = {
      email: 'email',
      detected_at: 'detected_at',
    }

    const SEARCH_FIELD_MAP = {
      email: 'email',
    }

    const query = this.connection
      .createQueryBuilder()
      .select('result.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'user.email as email',
            'rih.userKycHistoryId as user_kyc_history_id',
            'rih.userId as user_id',
            'rih.faceId as face_id',
            'rih.createdAt as detected_at',
          ])
          .from('rekognition_info_history', 'rih')
          .leftJoin('user', 'user', 'user.id = rih.user_id')
      }, 'result')

    const { searchField, searchText, faceId, exceptUserId, sort, sortType } =
      filter

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${SEARCH_FIELD_MAP[filter.searchField]} LIKE :keyword`)
          } else {
            Object.keys(SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (faceId) {
      query.andWhere('face_id = :faceId', { faceId })
    }

    if (exceptUserId) {
      query.andWhere('user_id != :exceptUserId', { exceptUserId })
    }

    if (sort && SORT_FIELD_MAP[sort]) {
      query.orderBy(SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      query.orderBy('detected_at', 'DESC')
    }
    query.addOrderBy('user_id', 'ASC')

    return query
  }
}
