<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('missingRewards') }}
      </div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" ref="rewardTable">
        <template v-slot:cell-campaign_id="{ row: rewardLog }">
          <router-link :to="'/campaign/detail/' + rewardLog.campaign_id">
            {{ rewardLog.campaign_id }}
          </router-link>
        </template>
        <template v-slot:cell-wallet="{ row: rewardLog }">
          {{ rewardLog.wallet.toUpperCase() }}
        </template>
        <template v-slot:cell-note="{ row: rewardLog }">
          <input
            class="form-control w-150px"
            type="text"
            :value="getLogs(rewardLog.note)"
            onkeypress="return false;"
          />
        </template>
        <template v-slot:cell-balance_response="{ row: rewardLog }">
          <input
            class="form-control w-150px"
            type="text"
            :value="rewardLog.balance_response"
            onkeypress="return false;"
          />
        </template>
        <template v-slot:cell-action="{ row: rewardLog }">
          <div class="d-flex justify-content-around flex-wrap">
            <!-- <div v-if="rewardLog.status === rewardLogStatus.NEED_TO_RESOLVE">
              <button
                class="btn btn-sm btn-primary me-3"
                @click="
                  resolveMissingReward(rewardLog.id, rewardLogStatus.RESOLVED)
                "
              >
                {{ $t('markAsResolved') }}
              </button>
              <button
                class="btn btn-sm btn-primary"
                @click="
                  resolveMissingReward(rewardLog.id, rewardLogStatus.RETRYING)
                "
              >
                {{ $t('retry') }}
              </button>
            </div> -->
            <div v-if="rewardLog.status === rewardLogStatus.FAILED">
              <button
                class="btn btn-sm btn-primary"
                @click="
                  resolveMissingReward(rewardLog.id, rewardLogStatus.FAILED)
                ">
                {{ $t('retry') }}
              </button>
            </div>
          </div>
        </template>
      </datatable>
    </div>
  </div>
  <div v-if="loading" class="overlay-loader" v-loading="true"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud, trimEndSmallDecimal } from '@/core/helpers/common.helper'
import { CampaignService } from '@/services/CampaignService'
import Datatable, {
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import moment from 'moment'
import Swal from 'sweetalert2'
import { HttpStatus } from '@/core/variables/common.enum'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import { RewardLogStatus } from '@/core/data/campaign/reward-log'

export default defineComponent({
  name: 'missing-rewards',
  components: {
    Datatable,
  },
  setup() {
    const store = useStore()

    return {
      refreshMissingRewardsCount: () =>
        store.dispatch(Actions.FETCH_MISSING_REWARDS_COUNT),
    }
  },
  data() {
    return {
      rewardLogStatus: RewardLogStatus,
      tableConfig: {
        columns: [
          {
            title: 'referenceId',
            key: 'reference_id',
            sortable: true,
            class: 'text-center',
          },
          {
            title: 'campaignId',
            key: 'campaign_id',
            sortable: true,
            class: 'text-center td-w-100px',
          },
          {
            title: 'missionId',
            key: 'mission_id',
            sortable: true,
            class: 'text-center td-w-100px',
          },
          {
            title: 'userId',
            key: 'user_id',
            sortable: true,
            class: 'text-center td-w-100px',
          },
          {
            title: 'amount',
            key: 'money_earned',
            sortable: false,
            class: 'text-center',
            render: (value) => {
              return trimEndSmallDecimal(value)
            },
          },
          {
            title: 'currency',
            key: 'currency',
            class: 'text-center',
            sortable: false,
          },
          {
            title: 'wallet',
            key: 'wallet',
            sortable: false,
            class: 'text-center',
          },
          {
            title: 'note',
            key: 'note',
            sortable: false,
            class: 'text-center td-w-170px',
          },
          {
            title: 'Balance response',
            key: 'balance_response',
            sortable: false,
            class: 'text-center',
          },
          {
            title: 'createDate',
            key: 'created_at',
            sortable: true,
            class: 'text-center',
            render: (value) => {
              return moment.unix(value).format('YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'action',
            sortable: false,
          },
        ],
        searchColumns: [],
        configPage: true,
        dataSource: CampaignService.getMissingRewards,
      } as ITableConfig,
      CONFIG,
      loading: false,
    }
  },
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.missingRewards', [
      'menu.marketingFunctions',
    ])
  },
  methods: {
    refreshTable() {
      if (this.$refs.rewardTable) {
        ;(this.$refs.rewardTable as IDatatableContext).getData()
      }
    },
    async resolveMissingReward(id, status) {
      const confirmMessage =
        status === RewardLogStatus.RESOLVED
          ? this.$t('confirmResolveReward')
          : this.$t('confirmRetryReward')
      const succeedMessage =
        status === RewardLogStatus.RESOLVED
          ? this.$t('resolveRewardSuccess')
          : this.$t('retryRewardSuccess')
      const failMessage =
        status === RewardLogStatus.RESOLVED
          ? this.$t('resolveRewardFail')
          : this.$t('retryRewardFail')

      const { isConfirmed } = await Swal.fire({
        text: confirmMessage,
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        return
      }

      this.loading = true
      const res = await CampaignService.resolveMissingReward(id, status)
      console.log('🚀 ~ file: MissingRewards.vue:215 ~ res:', res)
      this.loading = false
      if (res.status === HttpStatus.OK && res.data?.success) {
        this.$toastr.success(succeedMessage)
        this.refreshTable()
        this.refreshMissingRewardsCount()
        return
      }

      this.$toastr.error(failMessage)
    },
    getLogs: function (log) {
      try {
        return JSON.stringify(JSON.parse(log)?.note)
      } catch (error) {
        return log
      }
    },
  },
})
</script>

<style lang="scss">
.overlay-loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}
</style>
