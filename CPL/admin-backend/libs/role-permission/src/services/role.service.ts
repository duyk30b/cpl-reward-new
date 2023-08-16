import {
  BusinessException,
  escapeLikeChars,
  formatPaginate,
  ValidationException,
} from '@lib/util'
import { Injectable } from '@nestjs/common'
import { paginateRaw } from 'nestjs-typeorm-paginate'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Brackets, In, Not, Repository } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import {
  ICreateRoleDto,
  ISearchRoleDto,
  IUpdateRoleDto,
} from '../interfaces/role.interface'
import { RoleError, ValidationError } from '@lib/util/formater/error'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRole: ICreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        name: createRole.name,
      },
    })
    if (role) {
      throw new ValidationException([
        {
          property: 'name',
          constraints: {
            existed: ValidationError.EXISTED_IN_SYSTEM,
          },
        },
      ])
    }
    const newRole = plainToInstance(RoleEntity, createRole, {
      ignoreDecorators: true,
    })
    return await this.roleRepository.save(newRole)
  }

  async getAll() {
    return await this.roleRepository.find()
  }

  async findById(id: string) {
    return await this.roleRepository.findOne(id)
  }

  async findByIds(ids: string[]) {
    return await this.roleRepository.find({ id: In(ids) })
  }

  async update(id: string, updateRole: IUpdateRoleDto) {
    const role = await this.roleRepository.findOne(id)
    if (!role) {
      throw new BusinessException(RoleError.NOT_FOUND)
    }
    const existedRole = await this.roleRepository.findOne({
      where: {
        name: updateRole.name,
        id: Not(id),
      },
    })
    if (existedRole) {
      throw new ValidationException([
        {
          property: 'name',
          constraints: {
            existed: ValidationError.EXISTED_IN_SYSTEM,
          },
        },
      ])
    }
    role.name = updateRole.name
    role.description = updateRole.description
    return await this.roleRepository.save(role)
  }

  async delete(id: string) {
    return await this.roleRepository.delete(id)
  }

  async search(search: ISearchRoleDto) {
    const ROLE_SORT_FIELD_MAP = {
      id: 'id',
      name: 'name',
      description: 'description',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }

    const ROLE_SEARCH_FIELD_MAP = {
      name: 'name',
      description: 'description',
    }

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .select([
        'role.id as id',
        'role.name as name',
        'role.description as description',
        'role.created_at as created_at',
      ])

    const { searchField, searchText, sort, sortType } = search
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && ROLE_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${ROLE_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(ROLE_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${ROLE_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && ROLE_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(ROLE_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    queryBuilder.addOrderBy('id', 'DESC')

    const options = {
      page: search.page || 1,
      limit: search.limit || 20,
    }
    return formatPaginate(paginateRaw<RoleEntity>(queryBuilder, options))
  }
}
