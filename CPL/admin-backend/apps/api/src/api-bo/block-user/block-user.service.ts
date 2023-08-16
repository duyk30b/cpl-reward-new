import { GrpcBlockUserService } from '@lib/grpc-client/bo/block-user/block-user.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlockUserService {
  /**
   * constructor
   * @param grpcBlockUserService
   */
  constructor(private readonly grpcBlockUserService: GrpcBlockUserService) {}

  /**
   * create
   * @param createBlockUserDto
   * @returns
   */
  async create(createBlockUserDto) {
    return await this.grpcBlockUserService.create(createBlockUserDto)
  }

  /**
   * findAll
   * @param listBlockUserDto
   * @returns
   */
  async findAll(listBlockUserDto) {
    const data = await this.grpcBlockUserService.findAll(listBlockUserDto)
    return data.data
  }

  /**
   * findOneById
   * @param findOneByIdDto
   * @returns
   */
  async findOneById(findOneByIdDto) {
    return await this.grpcBlockUserService.findOne(findOneByIdDto)
  }

  /**
   * delete
   * @param deleteDto
   * @returns
   */
  async delete(deleteDto) {
    return await this.grpcBlockUserService.delete(deleteDto)
  }

  /**
   * export
   * @param listBlockUserDto
   * @returns
   */
  async export(listBlockUserDto) {
    return await this.grpcBlockUserService.export(listBlockUserDto)
  }
}
