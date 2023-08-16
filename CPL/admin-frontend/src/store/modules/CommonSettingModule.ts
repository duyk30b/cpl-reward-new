import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Country } from '@/models/common/MasterData'
import { CoinItem } from '@/models/setting-exchange/CoinSetting'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { Actions, Mutations } from '@/store/enums/StoreEnums'
import { plainToInstance } from 'class-transformer'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { CategoryTranslateState } from '../state/translate.state'

export interface IMasterdata {
  countries: Country[]
}

export interface IListCoinGroupByCoin {
  [coin: string]: CoinItem
}

@Module
export default class CommonSettingModule extends VuexModule {
  kafkaEvents = []
  targetUsers = []
  targetWallets = []
  grantMethods = []
  propertiesToCalculateAmount = []
  userConditions = {}
  displayConditions = {}
  coins = []
  coinsDataGroupByCoin = {}
  categoryLanguageState: CategoryTranslateState = {
    loading: false,
    translates: [],
    error: undefined,
  }
  codeLanguages: string[] = []

  private _masterdata = {} as IMasterdata

  /**
   * Get all Kafka Events
   * @returns object
   */
  get getKafkaEvents() {
    return this.kafkaEvents
  }

  get getTargetUsers() {
    return this.targetUsers
  }

  get getTargetWallets() {
    return this.targetWallets
  }

  get getGrantMethods() {
    return this.grantMethods
  }

  get getPropertiesToCalculateAmount() {
    return this.propertiesToCalculateAmount
  }

  get getUserConditions() {
    return this.userConditions
  }

  get getDisplayConditions() {
    return this.displayConditions
  }

  get listCoin() {
    return this.coins
  }

  get listCoinRaw() {
    return this.coinsDataGroupByCoin
  }

  get masterdata() {
    return this._masterdata
  }

  get categoryTranslatesState(): CategoryTranslateState {
    return this.categoryLanguageState
  }

  get codeLanguagesActive() {
    return this.codeLanguages
  }

  @Mutation
  [Mutations.SET_KAFKA_EVENTS](payload) {
    this.kafkaEvents = payload
  }

  @Mutation
  [Mutations.SET_GRANT_TARGET](payload) {
    this.targetUsers = payload.users
    this.targetWallets = payload.wallets
    this.grantMethods = payload.methods
    this.propertiesToCalculateAmount = payload.propertiesToCalculateAmount
  }

  @Mutation
  [Mutations.SET_USER_CONDITION](payload) {
    this.userConditions = payload.list
  }

  @Mutation
  [Mutations.SET_DISPLAY_CONDITION](payload) {
    this.displayConditions = payload.list
  }

  @Mutation
  [Mutations.SET_MASTERDATA](payload) {
    this._masterdata = payload
  }

  @Mutation
  [Mutations.SET_LIST_COIN](payload) {
    this.coins = payload
  }

  @Mutation
  [Mutations.SET_LIST_COIN_RAW](payload) {
    this.coinsDataGroupByCoin = payload
  }

  @Mutation
  [Mutations.SET_CODE_LANGUAGES_ACTIVE](payload: string[]) {
    this.codeLanguages = payload
  }

  @Mutation
  [Mutations.SET_CATEGORY_TRANSLATES](state: CategoryTranslateState) {
    this.categoryLanguageState = {
      ...this.categoryLanguageState,
      ...state,
    }
  }

  @Mutation
  [Mutations.SET_LOADING_CATEGORY_TRANSLATE](loading: boolean) {
    this.categoryLanguageState = {
      ...this.categoryLanguageState,
      loading,
    }
  }

  @Action
  async [Actions.FETCH_KAFKA_EVENTS_ACTION]() {
    const events = await ApiService.get('/campaign/events')
    this.context.commit(Mutations.SET_KAFKA_EVENTS, events.data)
  }

  @Action
  async [Actions.FETCH_GRANT_TARGET_ACTION]() {
    const res = await ApiService.get('/campaign/grant-targets')
    this.context.commit(Mutations.SET_GRANT_TARGET, res.data)
  }

  @Action({ rawError: true })
  async [Actions.FETCH_USER_CONDITION_ACTION]() {
    const res = await ApiService.get('/campaign/user-conditions')
    this.context.commit(Mutations.SET_USER_CONDITION, res.data)
  }

  @Action({ rawError: true })
  async [Actions.FETCH_DISPLAY_CONDITION_ACTION]() {
    const res = await ApiService.get('/campaign/display-conditions')
    this.context.commit(Mutations.SET_DISPLAY_CONDITION, res.data)
  }

  @Action
  async [Actions.FETCH_LIST_COIN]() {
    const res = await ApiService.get('/coin')
    if (res.status !== HttpStatus.OK) {
      return
    }

    let coins = res.data.map((item) => item.coin.toUpperCase())
    coins.sort()
    // Remove duplicate
    coins = coins.filter(function (item, pos) {
      return coins.indexOf(item) == pos
    })
    this.context.commit(Mutations.SET_LIST_COIN, coins)
  }

  @Action
  async [Actions.FETCH_LIST_COIN_RAW]() {
    const res = await ApiService.get('/coin')
    if (res.status !== HttpStatus.OK) {
      return
    }

    const coinsDataGroupByCoin = res.data.reduce((acc, item) => {
      acc[item.coin] = item

      return acc
    }, {} as IListCoinGroupByCoin)

    this.context.commit(Mutations.SET_LIST_COIN_RAW, coinsDataGroupByCoin)
  }

  @Action
  async [Actions.FETCH_MASTERDATA]() {
    const countryResponse = await ApiService.get('/setting/country-code')
    const data = {} as IMasterdata
    data.countries = (countryResponse.data?.data || []).map((country) =>
      plainToInstance(Country, country),
    )
    this.context.commit(Mutations.SET_MASTERDATA, data)
  }

  @Action
  async [Actions.FETCH_CATEGORY_TRANSLATES]() {
    this.context.commit(Mutations.SET_LOADING_CATEGORY_TRANSLATE, true)
    const response = await SettingExchangeService.getCategoryTranslates()

    const state = new CategoryTranslateState()
    state.loading = false
    if (response.status !== HttpStatus.OK) {
      state.error = response.data
      state.translates = []
    } else {
      state.error = undefined
      state.translates = response.data
    }
    this.context.commit(Mutations.SET_CATEGORY_TRANSLATES, state)
  }

  @Action
  async [Actions.FETCH_CODE_LANGUAGES_ACTIVE]() {
    const response = await SettingExchangeService.getCodeLanguage({
      type: 'active',
    })
    if (response.status !== HttpStatus.OK) {
      return
    }
    const results: string[] = response.data || []

    this.context.commit(Mutations.SET_CODE_LANGUAGES_ACTIVE, results)
  }
}
