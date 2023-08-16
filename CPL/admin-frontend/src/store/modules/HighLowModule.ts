import { getPeriodByValue } from '@/core/helpers/common.helper'
import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { HighLowService } from '@/services/HighLowService'
import { Actions, Mutations, Getters } from '@/store/enums/StoreEnums'
import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators'
export interface IHighLow {
  errors: any
  modes: Array<{ id: string; name: string }>
  pairs: Array<{ id: string; name: string }>
  period: Array<{ id: string; name: string }>
}
@Module
export default class HighLowModule extends VuexModule implements IHighLow {
  modes = []
  pairs = []
  period = []
  errors = {}

  get getModes() {
    return this.modes
  }

  get getPairs() {
    return this.pairs
  }

  get getPeriod() {
    return this.period
  }

  @Mutation
  [Mutations.SET_MODES](data) {
    this.modes = data
  }

  @Mutation
  [Mutations.SET_PAIRS](data) {
    this.pairs = data
  }

  @Mutation
  [Mutations.SET_PERIOD](period) {
    this.period = period
  }

  @Action
  async [Actions.FETCH_GET_MODES]() {
    const res = await ApiService.get('/bo/setting/trading-modes?get_only=true')
    if (res.status === HttpStatus.OK) {
      const modes = [{ id: '', name: 'all' }]
      const { data } = res.data
      for (let index = 0; index < data.length; index++) {
        modes.push({
          id: data[index].mode,
          name: data[index].name,
        })
      }

      this.context.commit(Mutations.SET_MODES, modes)
    }

    this.context.commit(Mutations.SET_ERROR, res.data.errors)
  }

  @Action
  async [Actions.FETCH_GET_PAIRS]() {
    const res = await ApiService.get('/bo/setting/trading-pair?get_only=true')
    if (res.status === HttpStatus.OK) {
      const pairs = [{ id: '', name: 'all' }]
      const { data } = res.data
      for (let index = 0; index < data.length; index++) {
        pairs.push({
          id: data[index].symbol,
          name: data[index].symbol,
        })
      }
      this.context.commit(Mutations.SET_PAIRS, pairs)
    }

    this.context.commit(Mutations.SET_ERROR, res.data.errors)
  }

  @Action
  async [Actions.FETCH_GET_PERIOD]() {
    const res = await ApiService.get('/bo/setting/period')
    if (res.status === HttpStatus.OK) {
      const period = [{ id: '', name: 'all' }]
      const { data } = res.data
      for (let index = 0; index < data.length; index++) {
        period.push({
          id: data[index].period,
          name: getPeriodByValue(data[index].period),
        })
      }

      this.context.commit(Mutations.SET_PERIOD, period)
    }

    this.context.commit(Mutations.SET_ERROR, res.data.errors)
  }
}
