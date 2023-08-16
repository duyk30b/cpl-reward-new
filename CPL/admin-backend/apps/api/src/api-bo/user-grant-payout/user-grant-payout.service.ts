import { IGrpcUserGrantPayoutUpdateRequest } from '@lib/grpc-client/bo/user-grant-payout'
import { GrpcUserGrantPayoutService } from '@lib/grpc-client/bo/user-grant-payout'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserGrantPayoutService {
  /**
   * constructor
   * @param grpcUserGrantPayoutService
   */
  constructor(
    private readonly grpcUserGrantPayoutService: GrpcUserGrantPayoutService,
  ) {}

  /**
   * create
   * @param createUserGrantPayoutDto
   * @returns
   */
  async create(createUserGrantPayoutDto) {
    return await this.grpcUserGrantPayoutService.create(
      createUserGrantPayoutDto,
    )
  }

  /**
   * update
   * @param updateUserGrantPayoutDto
   * @returns
   */
  async update(updateUserGrantPayoutDto, userId) {
    const updateUserGrantPayout: IGrpcUserGrantPayoutUpdateRequest = {
      userId,
      ...updateUserGrantPayoutDto,
    }
    Object.keys(updateUserGrantPayout).forEach((key) => {
      if (updateUserGrantPayout[key] === undefined) {
        delete updateUserGrantPayout[key]
      }
    })
    return await this.grpcUserGrantPayoutService.update(updateUserGrantPayout)
  }

  /**
   * findAll
   * @param listUserGrantPayoutDto
   * @returns
   */
  async findAll(listUserGrantPayoutDto) {
    const data = await this.grpcUserGrantPayoutService.findAll(
      listUserGrantPayoutDto,
    )
    return data.data
  }

  /**
   * findOneById
   * @param findOneByIdDto
   * @returns
   */
  async findOneById(findOneByIdDto) {
    return await this.grpcUserGrantPayoutService.findOne(findOneByIdDto)
  }

  /**
   * delete
   * @param deleteDto
   * @returns
   */
  async delete(deleteDto) {
    return await this.grpcUserGrantPayoutService.delete(deleteDto)
  }

  /**
   * export
   * @param listUserGrantPayoutDto
   * @returns
   */
  async export(listUserGrantPayoutDto) {
    return await this.grpcUserGrantPayoutService.export(listUserGrantPayoutDto)
  }
}
