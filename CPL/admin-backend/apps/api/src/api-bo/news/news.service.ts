import { GrpcNewsService } from '@lib/grpc-client/bo/news/news.service'
import { Injectable } from '@nestjs/common'
import { ListNewsDTO } from './news.dto'

@Injectable()
export class NewsService {
  /**
   * constructor
   * @param boTradingService
   */
  constructor(private readonly boTradingService: GrpcNewsService) {}

  /**
   * create
   * @param createNewsDto
   * @returns
   */
  async create(createNewsDto) {
    return await this.boTradingService.create(createNewsDto)
  }

  /**
   * findAll
   * @param listNewsDto
   * @returns
   */
  async findAll(listNewsDto: ListNewsDTO) {
    const data = await this.boTradingService.findAll(listNewsDto)
    return data.data
  }

  /**
   * findOneById
   * @param findOneByIdDto
   * @returns
   */
  async findOneById(findOneByIdDto) {
    return await this.boTradingService.findOne(findOneByIdDto)
  }

  /**
   * update
   * @param id
   * @param updateNewsDto
   * @returns
   */
  async update(id: number, updateNewsDto) {
    updateNewsDto.id = id
    return await this.boTradingService.update(updateNewsDto)
  }

  /**
   * delete
   * @param deleteDto
   * @returns
   */
  async delete(deleteDto) {
    return await this.boTradingService.delete(deleteDto)
  }

  /**
   * export
   * @param listNewsDto
   * @returns
   */
  async export(listNewsDto: ListNewsDTO) {
    return await this.boTradingService.export(listNewsDto)
  }
}
