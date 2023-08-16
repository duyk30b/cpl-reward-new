import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { In, Repository } from 'typeorm'
import { CreateFileDto } from '../dto/create-file.dto'
import { UploadedFile } from '../entities/uploaded-file.entity'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(UploadedFile)
    private readonly fileRepository: Repository<UploadedFile>,
  ) {}

  async create(createFileDto: CreateFileDto) {
    const file = plainToClass(UploadedFile, createFileDto, {
      ignoreDecorators: true,
    })
    return await this.fileRepository.save(file)
  }

  async getUploadedFileById(id: string) {
    return await this.fileRepository.findOne({ where: { id } })
  }

  async getUploadedFilesByIds(ids: string[]) {
    return await this.fileRepository.find({ where: { id: In(ids) } })
  }
}
