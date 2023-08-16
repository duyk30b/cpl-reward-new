import { GrpcUnlimitedUserService } from '@lib/grpc-client/bo/unlimited-user/unlimited-user.service'
import { Injectable } from '@nestjs/common'
import { FilterQueryDTO } from './unlimited-user.dto'

@Injectable()
export class UnlimitedUserService {
  /**
   * constructor
   * @param grpcUnlimitedUserService
   */
  constructor(
    private readonly grpcUnlimitedUserService: GrpcUnlimitedUserService,
  ) {}

  /**
   * create
   * @param createUnlimitedUserDto
   * @returns
   */
  async create(createUnlimitedUserDto) {
    return await this.grpcUnlimitedUserService.create(createUnlimitedUserDto)
  }

  /**
   * findAll
   * @param listUnlimitedUserDto
   * @returns
   */
  async findAll(listUnlimitedUserDto) {
    const data = await this.grpcUnlimitedUserService.findAll(
      listUnlimitedUserDto,
    )
    return data.data
  }

  /**
   * findOneById
   * @param findOneByIdDto
   * @returns
   */
  async findOneById(findOneByIdDto) {
    return await this.grpcUnlimitedUserService.findOne(findOneByIdDto)
  }

  /**
   * update
   * @param id
   * @param updateUnlimitedUserDto
   * @returns
   */
  async update(id: number, updateUnlimitedUserDto) {
    updateUnlimitedUserDto.id = id
    return await this.grpcUnlimitedUserService.update(updateUnlimitedUserDto)
  }

  /**
   * delete
   * @param deleteDto
   * @returns
   */
  async delete(deleteDto) {
    return await this.grpcUnlimitedUserService.delete(deleteDto)
  }

  /**
   * export
   * @param listUnlimitedUserDto
   * @returns
   */
  async export(listUnlimitedUserDto) {
    return await this.grpcUnlimitedUserService.export(listUnlimitedUserDto)
  }

  /**
   * findAllVerified
   * @param query
   * @returns
   */
  async findAllVerified(query: FilterQueryDTO) {
    const data = await this.grpcUnlimitedUserService.findAllVerified(query)
    return data.data
  }
}
