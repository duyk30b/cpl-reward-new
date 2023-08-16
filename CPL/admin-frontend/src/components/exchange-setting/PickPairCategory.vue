<template>
  <div class="pick-pair d-flex">
    <ul
      v-for="currency of currencyList"
      :key="currency"
      class="list-group col-sm-3"
    >
      <li class="list-group-item text-uppercase">
        <div class="d-flex">
          <label class="form-check form-check-custom form-check-solid me-2">
            <input
              class="form-check-input"
              name="pair_item"
              type="checkbox"
              :id="currency"
              :checked="currency.status"
              v-on:input="currency.status = $event.target.checked"
              @click="checkAllPair(currency.name, $event.target.checked)"
            />
          </label>
          {{ currency.name }}
        </div>
      </li>
      <li
        v-for="pair of currency.pairList"
        :key="pair"
        class="list-group-item text-uppercase"
      >
        <div class="d-flex">
          <label class="form-check form-check-custom form-check-solid me-2">
            <input
              class="form-check-input"
              name="pair_item"
              type="checkbox"
              :id="`${pair.coin}_${pair.currency}`"
              true-value="1"
              false-value="0"
              :checked="pair.status === PAIR_STATUS.ACTIVE"
              @click="
                checkPerPair(
                  currency.name,
                  (pair.status = $event.target.checked
                    ? PAIR_STATUS.ACTIVE
                    : PAIR_STATUS.INACTIVE),
                )
              "
            />
          </label>
          {{ pair.coin }}/{{ pair.currency }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { SubCategorySetting } from '@/models/setting-exchange/CategorySetting'
import { CategoryPairItem } from '@/models/setting-exchange/CategorySetting'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { defineComponent } from 'vue'
import CONFIG from '@/config'
import { plainToInstance } from 'class-transformer'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'

class CurrencyItem {
  name: string
  pairList: CategoryPairItem[]
  status: boolean
}

export default defineComponent({
  name: 'pick-pair-category',
  props: {
    smallCategory: {
      type: Object,
      default: {} as SubCategorySetting,
    },
  },
  data() {
    return {
      currencyList: [] as CurrencyItem[],
      PAIR_STATUS,
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const allPair = plainToInstance(
        CategoryPairItem,
        await this.getPairList(),
        {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        },
      )
      const subPair = plainToInstance(
        CategoryPairItem,
        (this.smallCategory as SubCategorySetting)['pairs'] || [],
        {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        },
      )
      const mergePair: CategoryPairItem[] = subPair
        .concat(allPair)
        .reduce((acc: CategoryPairItem[], cur) => {
          if (
            !acc.find((i) => i.coin === cur.coin && i.currency === cur.currency)
          ) {
            acc.push(cur)
          }
          return acc
        }, [])
      this.currencyList = CONFIG.CURRENCY_LIST.map((currency) => {
        const dataByCurrency = mergePair.filter(
          (item) => item.currency === currency,
        )
        return plainToInstance(CurrencyItem, {
          name: currency,
          status: dataByCurrency.every(
            (item) => item.status === PAIR_STATUS.ACTIVE,
          ),
          pairList: dataByCurrency.map((item) => {
            if (
              subPair.find(
                (i) => i.coin === item.coin && i.currency === item.currency,
              )
            ) {
              item.status = PAIR_STATUS.ACTIVE
            }
            return item
          }),
        })
      })
    })
  },
  methods: {
    checkAllPair(currency: string, isChecked: boolean) {
      for (const item of this.currencyList) {
        if (item.name == currency) {
          item.pairList = item.pairList.map((pair) => {
            return {
              coin: pair.coin,
              currency: pair.currency,
              status: isChecked ? PAIR_STATUS.ACTIVE : PAIR_STATUS.INACTIVE,
            }
          })
        }
      }

      this.$emit('changeCheckBox')
    },
    checkPerPair(currency: string) {
      for (const item of this.currencyList) {
        if (item.name === currency) {
          const disabledList = item.pairList.find((pair) => !pair.status)
          item.status = !disabledList
        }
      }

      this.$emit('changeCheckBox')
    },
    async getPairList(): Promise<CategoryPairItem[]> {
      const pairData = await SettingExchangeService.getListPairName()
      if (pairData.status != HttpStatus.OK) {
        return []
      }
      return pairData.data['data'].map((item) => ({
        coin: item.coin,
        currency: item.currency,
        status: PAIR_STATUS.INACTIVE,
      }))
    },
    getPairSelected(): CategoryPairItem[] {
      const result = [] as CategoryPairItem[]
      for (const currency of this.currencyList) {
        const dataCurrency = currency.pairList
        result.push(
          ...dataCurrency.filter((item) => item.status === PAIR_STATUS.ACTIVE),
        )
      }
      return result
    },
  },
})
</script>
<style lang="scss" scoped>
.currency-item {
  height: 40px;
}
</style>
