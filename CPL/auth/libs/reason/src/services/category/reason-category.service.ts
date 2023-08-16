import { Injectable } from '@nestjs/common'
import { ReasonCategoryEntity } from 'lib/reason/entities/reason-category.entity'
import {
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
  IReasonCategoryList,
} from 'lib/reason/interfaces/reason-category.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DeleteResult, Repository } from 'typeorm'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { escapeLikeChars, formatPaginate } from '@lib/util'
import { reasonLanguages } from 'lib/reason/interfaces/json-name.interface'
@Injectable()
export class ReasonCategoryService {
  constructor(
    @InjectRepository(ReasonCategoryEntity)
    private readonly reasonCategoryRepository: Repository<ReasonCategoryEntity>,
  ) {}

  async create(
    createReasonCategory: ICreateReasonCategory,
  ): Promise<ReasonCategoryEntity> {
    const entity = this.reasonCategoryRepository.create(createReasonCategory)
    return await this.reasonCategoryRepository.save(entity)
  }

  async findAll(
    reasonCategoryFilter: IReasonCategoryFilter,
  ): Promise<IReasonCategoryList> {
    const {
      page = 1,
      limit = 20,
      searchField = null,
      searchText = null,
      type = null,
      sort,
      sortType,
    } = reasonCategoryFilter

    const SORT_FIELD_MAP = {
      id: 'id',
      name: 'name',
      type: 'type',
      created_at: 'created_at',
    }

    const SEARCH_FIELD_MAP = {}

    reasonLanguages.forEach((lang) => {
      SEARCH_FIELD_MAP[`name_${lang}`] = `JSON_EXTRACT(name, '$.${lang}')`
    })

    const queryBuilder = this.reasonCategoryRepository.createQueryBuilder()

    const options: IPaginationOptions = {
      page,
      limit,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
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

    if (type) {
      queryBuilder.andWhere('type = :type', { type })
    }

    if (sort && SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(sort, sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    return await formatPaginate(paginate(queryBuilder, options))
  }

  async findById(id: string): Promise<IReasonCategory> {
    return this.reasonCategoryRepository.findOne(id)
  }

  async findByIds(ids: string[]): Promise<ReasonCategoryEntity[]> {
    return await this.reasonCategoryRepository.findByIds(ids)
  }

  async update(reasonCategory: IReasonCategory): Promise<ReasonCategoryEntity> {
    const existingEntity = await this.reasonCategoryRepository.findOne(
      reasonCategory.id,
    )
    if (!existingEntity) {
      throw new Error('Reason category not found')
    }
    const updatedEntity = this.reasonCategoryRepository.merge(
      existingEntity,
      reasonCategory,
    )
    return await this.reasonCategoryRepository.save(updatedEntity)
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingEntity = await this.reasonCategoryRepository.findOne(id)
    if (!existingEntity) {
      throw new Error('Reason category not found')
    }
    return await this.reasonCategoryRepository.delete(existingEntity.id)
  }
}
