import { formatPaginate } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import {
  IPaginationOptions,
  paginateRaw,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Connection, MoreThanOrEqual, Repository } from 'typeorm'
import { RelatedFaceDto } from '../dto/rekognition-related-face.dto'
import { RekognitionRelatedFace } from '../entities'
import { IFindRelatedFace } from '../interfaces/rekognition-related-face.interface'

@Injectable()
export class RekognitionRelatedFaceService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(RekognitionRelatedFace)
    private readonly rekognitionRelatedFaceRepository: Repository<RekognitionRelatedFace>,
  ) {}

  async saveRelatedFace(faceId1: string, faceId2: string, similarity: number) {
    const existed = await this.rekognitionRelatedFaceRepository.findOne({
      originFaceId: faceId1,
      relatedFaceId: faceId2,
    })
    if (!existed) {
      const newRecord = new RekognitionRelatedFace()
      newRecord.originFaceId = faceId1
      newRecord.relatedFaceId = faceId2
      newRecord.similarity = similarity
      await this.rekognitionRelatedFaceRepository.save(newRecord)
    }

    const reverseExisted = await this.rekognitionRelatedFaceRepository.findOne({
      originFaceId: faceId2,
      relatedFaceId: faceId1,
    })
    if (!reverseExisted) {
      const newReverseRecord = new RekognitionRelatedFace()
      newReverseRecord.originFaceId = faceId2
      newReverseRecord.relatedFaceId = faceId1
      newReverseRecord.similarity = similarity
      await this.rekognitionRelatedFaceRepository.save(newReverseRecord)
    }
  }

  async findRelatedFaces(filter: IFindRelatedFace) {
    const { faceId, exceptUserId, page, limit } = filter
    const query = this.connection
      .createQueryBuilder()
      .distinct(true)
      .select([
        'rrf.related_face_id as face_id',
        'rrf.similarity as similarity',
        'rrf.created_at as detected_at',
      ])
      .from('rekognition_related_face', 'rrf')
      .leftJoin(
        'rekognition_info_history',
        'rih',
        'rrf.related_face_id = rih.face_id',
      )
      .where('rrf.origin_face_id = :faceId', { faceId })

    if (exceptUserId) {
      query.andWhere('rih.user_id != :exceptUserId', { exceptUserId })
    }

    query.orderBy('rrf.similarity', 'DESC')
    query.addOrderBy('rrf.created_at', 'DESC')

    const options: IPaginationOptions = {
      page: page || 1,
      limit: limit || 25,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginateRaw(query, options))
    return {
      ...result,
      data: result.data.map((item) => plainToClass(RelatedFaceDto, item)),
    }
  }

  async checkHasRelatedFaceWithThreshold(faceId: string, threshold: number) {
    return await this.rekognitionRelatedFaceRepository.findOne({
      where: { originFaceId: faceId, similarity: MoreThanOrEqual(threshold) },
    })
  }
}
