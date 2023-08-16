import { BusinessException } from '@lib/util/exceptions/business.exception'
import { plainToInstance } from 'class-transformer'
import { isArray } from 'class-validator'
import { join } from 'path'
import { PaginationMetaDto } from './grpc-client.dto'

export function getProtoPath(protoFile: string) {
  return join(__dirname, 'proto', protoFile)
}

export function ParseResponseGrpc<T>(
  DataDto: any,
  result: any,
  isNotFormatData = false,
): T {
  try {
    if (!result.success) {
      throw new BusinessException(result.message)
    }
    if (result.data) {
      let data = result.data
      if (
        (data.items && isArray(data.items)) ||
        (data.meta && data.meta.currentPage > 0)
      ) {
        if (!isNotFormatData) {
          data.data = plainToInstance(DataDto, data.items, {
            ignoreDecorators: true,
          })
        } else {
          data.data = data.items
        }
        data.meta = plainToInstance(PaginationMetaDto, data.meta, {
          ignoreDecorators: true,
        })
        if (data.meta || data.pagination) {
          data.pagination = {
            total: data.meta.itemCount ? data.meta.totalItems : 0,
            page: data.meta.currentPage ? data.meta.currentPage : 1,
            size: data.meta.itemsPerPage ? data.meta.itemsPerPage : 0,
          }
        }
        delete data.items
        delete data.meta
      } else {
        data = plainToInstance(DataDto, data, { ignoreDecorators: true })
      }
      result.data = data
    }
    return result
  } catch (error: any) {
    throw new BusinessException(error.message)
  }
}

export function ParseResponseGrpcHotWallet(DataDto: any, result: any) {
  try {
    if (!result.message) {
      throw new BusinessException(result.message)
    }

    const data = plainToInstance(DataDto, result.data, {
      enableImplicitConversion: true,
    })

    const parsedResult: any = {
      data: data,
      message: result.message,
      time_stamp: result.timeStamp || new Date().getTime(),
      total_count: result.totalCount || 0,
      meta_data: result.metaData,
    }

    return parsedResult
  } catch (error: any) {
    throw new BusinessException(error.message)
  }
}

export function ParseResponseGrpcWalletBceAdmin(result: any) {
  try {
    if (!result.message) {
      throw new BusinessException(result.message)
    }

    const parsedResult: any = {
      data: result.data,
      message: result.message,
      time_stamp: result.timeStamp || new Date().getTime(),
      total_count: result.totalCount || 0,
      meta_data: result.metaData,
    }

    return parsedResult
  } catch (error: any) {
    throw new BusinessException(error.message)
  }
}

export function ParseResponseGrpcMT5<T>(
  DataDto: any,
  result: any,
  isNotFormatData = false,
): T {
  try {
    if (result.success && result.data) {
      let data = result.data
      if (
        (data.items && isArray(data.items)) ||
        (data.meta && data.meta.currentPage > 0)
      ) {
        if (!isNotFormatData) {
          data.data = plainToInstance(DataDto, data.items, {
            ignoreDecorators: true,
          })
        } else {
          data.data = data.items
        }
        data.meta = plainToInstance(PaginationMetaDto, data.meta, {
          ignoreDecorators: true,
        })
        if (data.meta || data.pagination) {
          data.pagination = {
            total: data.meta.itemCount ? data.meta.totalItems : 0,
            page: data.meta.currentPage ? data.meta.currentPage : 1,
            size: data.meta.itemsPerPage ? data.meta.itemsPerPage : 0,
          }
        }
        delete data.items
        delete data.meta
      } else {
        data = plainToInstance(DataDto, data, { ignoreDecorators: true })
      }
      result.data = data
    }
    return result
  } catch (error: any) {
    throw new BusinessException(error.message)
  }
}

export function ParseResponseGrpcHL<T>(
  DataDto: any,
  result: any,
  isNotFormatData = false,
): T {
  try {
    if (result.success && result.data) {
      let data = result.data
      if (
        (data.items && isArray(data.items)) ||
        (data.meta && data.meta.currentPage > 0)
      ) {
        if (!isNotFormatData) {
          data.data = plainToInstance(DataDto, data.items, {
            ignoreDecorators: true,
          })
        } else {
          data.data = data.items
        }
        data.meta = plainToInstance(PaginationMetaDto, data.meta, {
          ignoreDecorators: true,
        })
        if (data.meta || data.pagination) {
          data.pagination = {
            total: data.meta.itemCount ? data.meta.totalItems : 0,
            page: data.meta.currentPage ? data.meta.currentPage : 1,
            size: data.meta.itemsPerPage ? data.meta.itemsPerPage : 0,
          }
        }
        delete data.items
        delete data.meta
      } else {
        data = plainToInstance(DataDto, data, { ignoreDecorators: true })
      }
      result.data = data
    }
    return result
  } catch (error: any) {
    throw new BusinessException(error.message)
  }
}
