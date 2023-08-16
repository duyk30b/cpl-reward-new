<template>
  <div
    class="modal fade"
    id="convert-small-balance-detail"
    ref="convertSmallBalanceDetailRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="table-responsive mt-10">
          <table class="table align-middle common-table table-bordered">
            <thead>
              <tr>
                <th>{{ $t('email') }}</th>
                <th>{{ $t('date') }}</th>
                <th>{{ $t('convertSmallBalanceHistoryScreen.coin') }}</th>
                <th>{{ $t('convertSmallBalanceHistoryScreen.amount') }}</th>
                <th>{{ $t('convertSmallBalanceHistoryScreen.fee') }}</th>
                <th>
                  {{ $t('convertSmallBalanceHistoryScreen.castleReceived') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="listConvertSmallBalanceDetail.length > 0">
                <tr
                  v-for="convertSmallBalanceDetail in listConvertSmallBalanceDetail"
                  :key="convertSmallBalanceDetail.id"
                >
                  <td class="text-center">
                    {{ convertSmallBalanceDetail.email }}
                  </td>
                  <td class="text-center">
                    {{
                      convertTimestampToDate(
                        convertSmallBalanceDetail.created_at,
                        'YYYY-MM-DD HH:mm:ss',
                      )
                    }}
                  </td>
                  <td class="text-center">
                    {{ convertSmallBalanceDetail.coin_from.toUpperCase() }}
                  </td>
                  <td class="text-center">
                    {{
                      formatCurrencyAmount(
                        convertSmallBalanceDetail.amount_from,
                        convertSmallBalanceDetail.coin_from,
                        '0',
                        null,
                      )
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      formatCurrencyAmount(
                        convertSmallBalanceDetail.fee_amount,
                        convertSmallBalanceDetail.fee_coin,
                        '0',
                        null,
                      )
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      formatCurrencyAmount(
                        convertSmallBalanceDetail.amount_to,
                        convertSmallBalanceDetail.fee_coin,
                        '0',
                        null,
                      )
                    }}
                  </td>
                </tr>
              </template>
              <td v-else colspan="4" class="text-center py-5 text-muted">
                {{ $t('noData') }}
              </td>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ConvertSmallBalanceService } from '@/views/apps/convert-small-balance/services/ConvertSmallBalanceService'
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import { formatCurrencyAmount } from '@/core/helpers/util'
import { BalanceConvertSmallHistoryDetail } from '@/views/apps/convert-small-balance/definition/convert-small-balance.dto'

export default defineComponent({
  name: 'ConvertSmallBalanceDetail',
  data: () => ({
    convertSmallId: '',
    listConvertSmallBalanceDetail: [] as BalanceConvertSmallHistoryDetail[],
  }),
  methods: {
    convertTimestampToDate,
    formatCurrencyAmount,
    async beforeOpen(convertSmallId) {
      if (convertSmallId === this.convertSmallId) {
        return
      }
      await this.getListConvertSmallBalanceDetail(convertSmallId)
    },
    async getListConvertSmallBalanceDetail(convertSmallId) {
      this.convertSmallId = convertSmallId
      const data =
        await ConvertSmallBalanceService.listBalanceConvertSmallDetail(
          convertSmallId,
        )
      this.listConvertSmallBalanceDetail = data
    },
  },
})
</script>

<style lang="scss" scoped>
.modal {
  .modal-dialog {
    min-width: 992px;
  }
}
</style>
