import ApiService from '@/core/services/ApiService'
import JwtService from '@/core/services/JwtService'
import { Actions, Mutations, Getters } from '@/store/enums/StoreEnums'
import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators'
import { HttpStatus } from '@/core/variables/common.enum'
import router from '@/router'
import { CampaignService } from '@/services/CampaignService'
import { ElNotification } from 'element-plus'

export interface User {
  id: number
  name?: string
  surname?: string
  email: string
  password: string
  api_token: string
}

export interface UserAuthInfo {
  errors: unknown
  user: User
  isAuthenticated: boolean
}

@Module
export default class AuthModule extends VuexModule implements UserAuthInfo {
  errors = {}
  user = {} as User
  isAuthenticated = !!JwtService.getToken()
  autoRefreshTokenIntervalId = 0
  missingRewardsCount = 0
  refreshTokenInterval

  /**
   * Get current user object
   * @returns User
   */
  get currentUser(): User {
    return this.user
  }

  /**
   * Verify user authentication
   * @returns boolean
   */
  get isUserAuthenticated(): boolean {
    return this.isAuthenticated
  }

  /**
   * Get authentification errors
   * @returns array
   */
  get getErrors() {
    return this.errors
  }

  get [Getters.GET_MISSING_REWARDS_COUNT]() {
    return this.missingRewardsCount
  }

  @Mutation
  [Mutations.SET_ERROR](error) {
    this.errors = { ...error }
  }

  @Mutation
  [Mutations.SET_AUTH](data) {
    this.isAuthenticated = true
    this.user = data.user_info
    this.errors = {}
    JwtService.saveToken(data.access_token)
    JwtService.saveRefreshToken(data.refresh_token)
    ApiService.setHeader()
  }

  @Mutation
  [Mutations.SET_REFRESH_DATA](data) {
    this.isAuthenticated = true
    this.user = data.user_info
    this.errors = {}
    JwtService.saveToken(data.access_token)
    ApiService.setHeader()
  }

  @Mutation
  [Mutations.SET_USER](user) {
    this.user = user
  }

  @Mutation
  [Mutations.PURGE_AUTH]() {
    this.isAuthenticated = false
    this.user = {} as User
    this.errors = []
    JwtService.destroyToken()
  }

  @Mutation
  [Mutations.SET_MISSING_REWARDS_COUNT](count) {
    this.missingRewardsCount = count
  }

  @Action
  [Actions.LOGIN](credentials) {
    return ApiService.post('auth/login', credentials)
  }

  @Action
  async [Actions.VERIFY_LOGIN](credentials) {
    const res = await ApiService.post('auth/login-verify', credentials)
    if (res.status === HttpStatus.OK) {
      this.context.commit(Mutations.SET_AUTH, res.data)

      if (this.refreshTokenInterval) clearTimeout(this.refreshTokenInterval)
      this.refreshTokenInterval = setTimeout(() => {
        this.context.dispatch(Actions.REFRESH_ACCESS_TOKEN)
      }, (res.data.expires_in - 60) * 1000)
      return res
    }

    this.context.commit(Mutations.SET_ERROR, res.data.errors)
    return res
  }

  @Action
  [Actions.LOGOUT]() {
    this.context.commit(Mutations.PURGE_AUTH)
    router.push({ name: 'login' })
  }

  @Action
  [Actions.REGISTER](credentials) {
    return ApiService.post('register', credentials)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data)
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors)
      })
  }

  @Action
  [Actions.FORGOT_PASSWORD](payload) {
    return ApiService.post('forgot_password', payload)
      .then(() => {
        this.context.commit(Mutations.SET_ERROR, {})
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors)
      })
  }

  @Action
  async [Actions.REFRESH_ACCESS_TOKEN]() {
    const refreshToken = JwtService.getRefreshToken()

    if (!refreshToken) {
      this.context.dispatch(Actions.LOGOUT)
      return
    }

    try {
      const res = await ApiService.post('token', {
        refresh_token: refreshToken,
      })

      if (res.status == HttpStatus.UNAUTHORIZED) {
        return this.context.dispatch(Actions.LOGOUT)
      } else if (res.status != HttpStatus.OK) {
        return ElNotification.error(
          res.data?.message || res.statusText || 'Server error',
        )
      }

      this.context.commit(Mutations.SET_REFRESH_DATA, res.data)

      if (this.refreshTokenInterval) clearTimeout(this.refreshTokenInterval)
      this.refreshTokenInterval = setTimeout(() => {
        this.context.dispatch(Actions.REFRESH_ACCESS_TOKEN)
      }, (res.data.expires_in - 60) * 1000)
    } catch (error) {
      console.log(error)
      this.context.dispatch(Actions.LOGOUT)
    }
  }

  @Action
  async [Actions.FETCH_MISSING_REWARDS_COUNT]() {
    const res = await CampaignService.getMissingRewardsCount()
    if (res.status === HttpStatus.OK) {
      this.context.commit(Mutations.SET_MISSING_REWARDS_COUNT, res.data.count)
    }
  }
}
