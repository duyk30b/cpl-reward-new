<template>
  <div class="table-responsive">
    <table class="table table-borderless">
      <thead>
        <tr class="fw-bolder text-muted bg-light">
          <th class="ps-4 w-auto">{{ $t('userLabel') }}</th>
          <th class="w-auto" v-show="hasMethodPercent">
            {{ $t('grantMethod') }}
          </th>
          <th class="w-auto">{{ $t('amount') }}</th>
          <th class="w-auto" v-show="hasMethodPercent">
            {{ $t('propertyToCalculateAmount') }}
          </th>
          <th class="w-auto pe-4">{{ $t('wallet') }}</th>
          <th class="w-auto">{{ $t('currency') }}</th>
          <th class="w-auto pe-4">{{ $t('action') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, i) in grantTargets" :key="i">
          <tr>
            <td style="min-width: 120px">
              <select
                v-model="grantTargets[i].userType"
                @change="updateOriginGrantTarget"
                :disabled="grantTargets.length === 2"
                required
                class="form-control form-control-sm"
              >
                <option
                  v-for="target in DATA.users"
                  :value="target.key"
                  :key="target.key"
                >
                  {{ target.value }}
                </option>
              </select>
            </td>

            <td v-show="hasMethodPercent">
              <select
                v-model="grantTargets[i].grantMethod"
                @change="updateOriginGrantTarget"
                class="form-control form-control-sm"
              >
                <option
                  v-for="method in DATA.methods"
                  :value="method.key"
                  :key="method.key"
                >
                  {{ method.value }}
                </option>
              </select>
            </td>

            <td>
              <input
                v-model="grantTargets[i].amount"
                @change="updateOriginGrantTarget"
                required
                v-number
                class="form-control form-control-sm"
              />
            </td>

            <td v-show="hasMethodPercent">
              <select
                v-model="grantTargets[i].property"
                @change="updateOriginGrantTarget"
                :disabled="item.grantMethod !== 'percent'"
                required
                class="form-control form-control-sm"
              >
                <option
                  v-for="property in DATA.propertiesToCalculateAmount"
                  :value="property.key"
                  :key="property.key"
                >
                  {{ property.value }}
                </option>
              </select>
            </td>

            <td>
              <select
                v-model="grantTargets[i].wallet"
                @change="updateOriginGrantTarget"
                required
                class="form-control form-control-sm"
              >
                <option
                  v-for="target in DATA.wallets"
                  :value="target.key"
                  :key="target.key"
                  :disabled="target.key === 'DIRECT_CASHBACK'"
                >
                  {{ target.value }}
                </option>
              </select>
            </td>
            <td style="max-width: 200px">
              <!-- nếu là dạng percent thì disable và đơn vị là USDT -->
              <template v-if="item.grantMethod === 'percent'">
                <input
                  disabled
                  :value="grantTargets[i].currency"
                  class="form-control form-control-sm"
                />
              </template>

              <!-- dù không phải dạng percent mà lại có tên ví trùng với thằng bạn là percent thì cũng vẫn disable và đơn vị là USDT -->
              <template
                v-else-if="
                  grantTargets.findIndex((i) => i.grantMethod === 'percent') >=
                    0 && grantTargets[0].wallet == grantTargets[1].wallet
                "
              >
                <input
                  disabled
                  :value="grantTargets[i].currency"
                  class="form-control form-control-sm"
                />
              </template>

              <!-- còn trường hợp không phải percent: disable thằng thứ 2 nếu trùng tên ví -->
              <template v-else>
                <select
                  v-model="grantTargets[i].currency"
                  @change="updateOriginGrantTarget"
                  :disabled="
                    i === 1 && grantTargets[0].wallet == grantTargets[1].wallet
                  "
                  required
                  class="form-control form-control-sm"
                >
                  <option
                    v-for="(currency, i) in CoinStore.COINS.value"
                    :value="currency"
                    :key="i"
                  >
                    {{ currency }}
                  </option>
                </select>
              </template>
            </td>
            <td>
              <div
                v-if="grantTargets.length === 1"
                class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm float-end"
                @click="
                  grantTargets.push({
                    ...item,
                    userType:
                      item.userType === 'user' ? 'referral_user' : 'user',
                  }) && updateOriginGrantTarget()
                "
              >
                <span class="svg-icon svg-icon-3">
                  <inline-svg src="media/icons/duotune/general/gen041.svg" />
                </span>
              </div>
              <div
                v-if="grantTargets.length > 1"
                class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm float-end"
                @click="grantTargets.splice(i, 1) && updateOriginGrantTarget()"
              >
                <span class="svg-icon svg-icon-3">
                  <inline-svg src="media/icons/duotune/general/gen027.svg" />
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td :colspan="hasMethodPercent ? 7 : 5">
              <MissionTag
                :originTagIds="grantTargets[i].tagIds"
                @update:originTagIds="(e: number[]) => ((grantTargets[i].tagIds = e) && updateOriginGrantTarget())"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <h2 class="fw-bolder mt-2">{{ $t('budgetLimit') }}</h2>
    <div class="mt-5" v-for="(rule, index) in rewardRules" :key="index">
      <label
        class="col-lg-12 fw-bold text-muted"
        style="text-transform: capitalize"
      >
        {{ rule.key }} budget
      </label>
      <div class="d-flex justify-content-between mt-2">
        <div class="w-75 pe-4">
          <input
            v-model.number="rule.limitValue"
            @change="updateOriginRewardRule"
            :disabled="
              !grantTargets.find((i) =>
                i.wallet.toLowerCase().includes(rule.key.toLowerCase()),
              )
            "
            :required="
              !!grantTargets.find((i) =>
                i.wallet.toLowerCase().includes(rule.key.toLowerCase()),
              )
            "
            :min="
              grantTargets.reduce(
                (t, i) =>
                  i.wallet.toLowerCase().includes(rule.key.toLowerCase())
                    ? t + Number(i.amount)
                    : t,
                0,
              )
            "
            v-number
            class="form-control form-control-sm"
          />
        </div>
        <div class="w-25">
          <input
            class="form-control form-control-sm w-100"
            v-model="rule.currency"
            disabled
          />
        </div>
      </div>
    </div>

    <h2 class="fw-bolder mt-5">{{ $t('statsReleasedMoney') }}</h2>
    <div class="mt-5" v-for="(rule, index) in originRewardRules" :key="index">
      <label
        class="col-lg-12 fw-bold text-muted"
        style="text-transform: capitalize"
      >
        Released {{ rule.key }}
      </label>
      <div class="d-flex justify-content-between">
        <div class="w-75 pe-4 mt-2">
          <input
            class="form-control form-control-sm"
            :value="rule.releaseValue"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { RewardRule } from '../module/reward-rule'
import { CoinStore } from '../store/coin.store'
import { TTargetResponse } from '../store/mission-grant-target.store'
import MissionTag from './MissionTag.vue'

type ITarget = {
  amount: string
  currency: string
  grantMethod: 'fixed' | 'percent'
  property: string
  tagIds: number[]
  userType: 'user' | 'referral_user'
  wallet: 'DIRECT_BALANCE' | 'DIRECT_CASHBACK' | 'DIRECT_REWARD'
}

export default defineComponent({
  components: { MissionTag },

  props: {
    originGrantTarget: { type: String, default: () => '[]' },
    hasMethodPercent: { type: Boolean, default: () => false },
    originRewardRules: {
      type: Array as PropType<RewardRule[]>,
      default: () => [],
    },
    missionId: { type: Number, default: () => null },
    DATA: {
      type: Object as PropType<TTargetResponse>,
      default: () => ({ x: {} }),
    },
  },

  setup(props) {
    const rewardRules = RewardRule.fromInstances(props.originRewardRules)
    const grantTargets = (JSON.parse(props.originGrantTarget) as any[]).map(
      (i) => ({
        userType: i.user || 'user',
        grantMethod: i.grant_method || 'fixed',
        amount: i.amount,
        property:
          i.grant_method === 'percent' ? i.property_to_calculate_amount : '',
        wallet: i.wallet,
        currency: i.grant_method === 'percent' ? 'USDT' : i.currency,
        tagIds: i.tag_ids,
      }),
    )

    return {
      rewardRules: ref<RewardRule[]>(rewardRules),
      grantTargets: ref<ITarget[]>(grantTargets),
      CoinStore,
    }
  },

  methods: {
    updateOriginGrantTarget() {
      if (
        this.grantTargets.length === 2 &&
        this.grantTargets[0].wallet === this.grantTargets[1].wallet
      ) {
        if (
          this.grantTargets[0].grantMethod === 'percent' ||
          this.grantTargets[1].grantMethod === 'percent'
        ) {
          this.grantTargets[1].currency = this.grantTargets[0].currency = 'USDT'
        } else {
          this.grantTargets[1].currency = this.grantTargets[0].currency
        }
      }

      const data = this.grantTargets.map((i) => ({
        user: i.userType || 'user',
        grant_method: i.grantMethod || 'fixed',
        amount: i.amount,
        property_to_calculate_amount:
          i.grantMethod === 'percent' ? i.property : '',
        wallet: i.wallet,
        currency: i.grantMethod === 'percent' ? 'USDT' : i.currency,
        tag_ids: i.tagIds,
      }))
      this.$emit('update:originGrantTarget', JSON.stringify(data))
    },

    updateOriginRewardRule() {
      const data = RewardRule.fromInstances(this.rewardRules)
      this.$emit('update:originRewardRules', data)
    },
  },
})
</script>
