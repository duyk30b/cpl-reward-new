import { Injectable } from '@nestjs/common'
import { Brackets, DeleteResult, In, Repository } from 'typeorm'
import { ReasonCategoryService } from 'lib/reason/services/category/reason-category.service'
import {
  ICreateReason,
  IReason,
  IReasonFilter,
  IReasonList,
} from 'lib/reason/interfaces/reason.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { ReasonEntity } from 'lib/reason/entities/reason.entity'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { escapeLikeChars, formatPaginate } from '@lib/util'
import { reasonLanguages } from 'lib/reason/interfaces/json-name.interface'

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(ReasonEntity)
    private readonly reasonRepository: Repository<ReasonEntity>,
    private readonly reasonCategoryService: ReasonCategoryService,
  ) {}

  async create(createReason: ICreateReason): Promise<IReason> {
    const { categoryId } = createReason
    const category = await this.reasonCategoryService.findById(categoryId)
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`)
    }
    const entity = this.reasonRepository.create(createReason)
    return this.reasonRepository.save(entity)
  }

  async findAll(reasonFilter: IReasonFilter): Promise<IReasonList> {
    const {
      page = 1,
      limit = 20,
      searchText = null,
      searchField = null,
      categoryId = null,
      sort,
      sortType,
    } = reasonFilter

    const REASON_SORT_FIELD_MAP = {
      id: 'id',
      name: 'name',
      category_id: 'category_id',
      created_at: 'created_at',
    }

    const SEARCH_FIELD_MAP = {}

    reasonLanguages.forEach((lang) => {
      SEARCH_FIELD_MAP[`name_${lang}`] = `JSON_EXTRACT(name, '$.${lang}')`
    })

    const queryBuilder = this.reasonRepository.createQueryBuilder()

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

    if (categoryId) {
      queryBuilder.andWhere('category_id = :categoryId', {
        categoryId,
      })
    }

    if (sort && REASON_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(sort, sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    return await formatPaginate(paginate(queryBuilder, options))
  }

  async findById(id: string): Promise<IReason> {
    return this.reasonRepository.findOne(id)
  }

  async update(reason: IReason): Promise<IReason> {
    const existingEntity = await this.reasonRepository.findOne(reason.id)

    if (!existingEntity) {
      throw new Error('Reason not found')
    }

    return await this.reasonRepository.save(reason)
  }

  async delete(id: string): Promise<DeleteResult> {
    const existingEntity = await this.reasonRepository.findOne(id)

    if (!existingEntity) {
      throw new Error('Reason not found')
    }

    return await this.reasonRepository.delete(existingEntity.id)
  }

  async findByCategoryIds(ids: string[]): Promise<IReason[]> {
    return await this.reasonRepository.find({
      where: {
        categoryId: In(ids),
      },
    })
  }
}
