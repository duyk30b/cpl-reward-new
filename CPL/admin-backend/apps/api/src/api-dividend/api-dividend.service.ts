import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  GetDividendsListRequest,
  DividendAPIResponse,
  GetDividendCampaignNameRequest,
  GetDividendCodesRequest,
  GetUsersDisableDividendRequest,
  GetHistoriesRequest,
  ToggleDividendCodeDTO,
  CreateDividendCodeDTO,
  CreateDividendDTO,
  EditDividendDTO,
  ReviewCodeDTO,
} from './api-dividend.dto'
import { UserService } from '@lib/grpc-client/user'
@Injectable()
export class DividendService {
  private ApiEndpoint
  private logger = new Logger(DividendService.name)
  /**
   *
   * @param httpService
   */
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.ApiEndpoint = this.configService.get('dividend.internal_api')
  }

  async getDividends(query: GetDividendsListRequest): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/campaigns`, {
          params: {
            ...query,
          },
        }),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async getDividendDetail(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/campaigns/${id}`),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async getDividendCampaignName(
    query: GetDividendCampaignNameRequest,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/campaign-names`, {
          params: {
            ...query,
          },
        }),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async getDividendCampaignNameAdvanced(
    query: GetDividendCampaignNameRequest,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.ApiEndpoint}/admin/campaign-names-advanced`,
          {
            params: {
              ...query,
            },
          },
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async getDividendCodes(query: GetDividendCodesRequest): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/codes`, {
          params: {
            ...query,
          },
        }),
      )

      const responseData = response.data
      if ('data' in response.data) {
        const listEmailUsers = {}
        // get list userIds
        const userIds = response.data.data.map((user) => {
          return user.user_id
        })

        // get user information by userIds from auth service
        const listUsers = await this.userService.findByIds(userIds)
        if (Object.keys(listUsers).length > 0) {
          for (const user of listUsers) {
            listEmailUsers[user.id] = user.email
          }
        }

        // map email
        const data = response.data.data.map((user) => {
          return {
            ...user,
            email: listEmailUsers?.[user.user_id] ?? '',
          }
        })
        responseData['data'] = data
      }

      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: responseData,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async getDividendAdvanced(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.ApiEndpoint}/admin/campaigns/${id}/statistics`,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async createDividend(data: CreateDividendDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.ApiEndpoint}/admin/campaigns`, data),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async editDividend(data: EditDividendDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/campaigns/update`,
          data,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async cancelDividend(id: number): Promise<any> {
    try {
      const data = { id }
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/campaigns/cancel`,
          data,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async createCodes(data: CreateDividendCodeDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.ApiEndpoint}/admin/codes`, data),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async toggleDividendCode(data: ToggleDividendCodeDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/codes/toggle-disability`,
          data,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async getHistories(query: GetHistoriesRequest): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/users`, {
          params: {
            ...query,
          },
        }),
      )

      const responseData = response.data
      if ('data' in response.data) {
        const listEmailUsers = {}
        // get list userIds
        const userIds = response.data.data.map((user) => {
          return user.user_id
        })

        // get user information by userIds from auth service
        const listUsers = await this.userService.findByIds(userIds)
        if (Object.keys(listUsers).length > 0) {
          for (const user of listUsers) {
            listEmailUsers[user.id] = user.email
          }
        }

        // map email
        const data = response.data.data.map((user) => {
          return {
            ...user,
            email: listEmailUsers?.[user.user_id] ?? '',
          }
        })
        responseData['data'] = data
      }

      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: responseData,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async disableUserDividend(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.ApiEndpoint}/admin/disabled-users`, {
          id,
        }),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: {
          message: e.message,
          error: e?.response?.data ?? '',
        },
      })
    }
  }

  async getUsersDisableDividend(
    query: GetUsersDisableDividendRequest,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/disabled-users`, {
          params: {
            ...query,
          },
        }),
      )
      const responseData = response.data
      if ('data' in response.data) {
        const listEmailUsers = {}
        // get list userIds
        const userIds = response.data.data.map((user) => {
          return user.user_id
        })

        // get user information by userIds from auth service
        const listUsers = await this.userService.findByIds(userIds)
        if (Object.keys(listUsers).length > 0) {
          for (const user of listUsers) {
            listEmailUsers[user.id] = user.email
          }
        }

        // map email
        const data = response.data.data.map((user) => {
          return {
            ...user,
            email: listEmailUsers?.[user.user_id] ?? '',
          }
        })
        responseData['data'] = data
      }

      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: responseData,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message },
      })
    }
  }

  async deleteDisableUserDividend(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/disabled-users/delete`,
          { id },
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: { message: e.message, error: e?.response?.data ?? '' },
      })
    }
  }

  async reviewCode(query: ReviewCodeDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.ApiEndpoint}/admin/codes/${query.code}/review?user_id=${query.user_id}`,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: {
          message: e.message,
          error: e?.response?.data ?? '',
        },
      })
    }
  }

  async activeCode(body: ReviewCodeDTO): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/codes/${body.code}/active`,
          {
            code: body.code,
            user_id: `${body.user_id}`,
          },
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: {
          message: e.message,
          error: e?.response?.data ?? '',
        },
      })
    }
  }

  async deleteCode(code: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.ApiEndpoint}/admin/codes/${code}/delete-user`,
        ),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: {
          message: e.message,
          error: e?.response?.data ?? '',
        },
      })
    }
  }

  async getCodesOfUser(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.ApiEndpoint}/admin/user-codes/${id}`),
      )
      return plainToInstance(DividendAPIResponse, {
        success: true,
        data: response.data,
      })
    } catch (e) {
      this.logger.error(e)
      return plainToInstance(DividendAPIResponse, {
        success: false,
        data: {
          message: e.message,
          error: e?.response?.data ?? '',
        },
      })
    }
  }
}
