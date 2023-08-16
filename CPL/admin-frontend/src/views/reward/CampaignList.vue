<template>
  <ModalAddCampaign ref="modalAddCampaign" @success="handleModalSuccess" />
  <div class="card">
    <div class="card-header border-0 pt-6 mb-6">
      <div class="d-flex align-items-center position-relative my-1">
        <span class="svg-icon svg-icon-1 position-absolute ms-6">
          <inline-svg src="media/icons/duotune/general/gen021.svg" />
        </span>
        <input
          class="form-control form-control-solid w-250px ps-14"
          :placeholder="$t('searchCampaigns')"
          v-model="searchText"
          @keyup="startSearch"
          maxlength="255"
        />
      </div>
      <div>
        <button type="button" class="btn btn-primary" @click="modalAddCampaign?.openModal()">
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
          </span>
          {{ $t('addCampaign') }}
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="table-wrapper">
        <div class="table-responsive mb-4">
          <table class="table dataTable align-middle fs-6 gy-5 common-table table-bordered">
            <thead>
              <tr>
                <th @click="changeSort('id')" :class="sortClass('id')">
                  {{ $t('id') }}
                </th>
                <th @click="changeSort('title')" :class="sortClass('title')">
                  {{ $t('campaignName') }}
                </th>
                <th>{{ $t('type') }}</th>

                <th @click="changeSort('status')" :class="sortClass('status')">
                  {{ $t('status') }}
                </th>
                <th @click="changeSort('start_date')" :class="sortClass('start_date')">
                  {{ $t('startDate') }}
                </th>
                <th @click="changeSort('end_date')" :class="sortClass('end_date')">
                  {{ $t('endDate') }}
                </th>
                <th>{{ $t('releasedCashback') }}</th>
                <th>{{ $t('releasedRealBalance') }}</th>
                <th>{{ $t('releasedRealReward') }}</th>
                <th @click="changeSort('priority')" :class="sortClass('priority')">
                  {{ $t('priority') }}
                </th>
                <th @click="changeSort('created_at')" :class="sortClass('created_at')">
                  {{ $t('createdAt') }}
                </th>
                <th>{{ $t('action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="campaigns.length == 0">
                <td colspan="13" class="text-center py-5 text-muted">{{ $t('noData') }}</td>
              </tr>
              <tr v-for="campaign in campaigns" :key="campaign.id">
                <td style="min-width: 50px; text-align: center">{{ campaign.id }}</td>
                <td>{{ campaign.title }}</td>
                <td>
                  <span v-if="campaign.type === CampaignType.DEFAULT">{{ $t('campaignDefault') }}</span>
                  <span v-if="campaign.type === CampaignType.DAILY">{{ $t('campaignDaily') }}</span>
                </td>
                <td>
                  <div v-if="!campaign.isActive">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="$t(`campaignStatus.99999`)"
                      placement="top-start"
                    >
                      <div class="d-block mt-1 badge badge-secondary">
                        <s>{{ $t(`campaignStatus.${campaign.status}`) }}</s>
                      </div>
                    </el-tooltip>
                  </div>
                  <div
                    v-else
                    class="d-block badge"
                    :class="{
                      'badge-primary': Date.now() <= new Date(campaign.startDate).getTime(),
                      'badge-danger': new Date(campaign.endDate).getTime() <= Date.now(),
                      'badge-success':
                        new Date(campaign.startDate).getTime() < Date.now() &&
                        Date.now() < new Date(campaign.endDate).getTime(),
                    }"
                  >
                    {{ $t(`campaignStatus.${campaign.status}`) }}
                  </div>
                </td>
                <td>{{ timeToText(campaign.startDate, 'YYYY-MM-DD hh:mm') }}</td>
                <td>{{ timeToText(campaign.endDate, 'YYYY-MM-DD hh:mm') }}</td>
                <td>{{ calculatorRelease(campaign.rewardRules, 'cashback') }}</td>
                <td>{{ calculatorRelease(campaign.rewardRules, 'balance') }}</td>
                <td>{{ calculatorRelease(campaign.rewardRules, 'reward') }}</td>
                <td>{{ campaign.priority }}</td>
                <td>{{ timeToText(campaign.createdAt, 'YYYY-MM-DD hh:mm') }}</td>
                <td>
                  <router-link
                    :to="{ name: 'campaign.detail', params: { id: campaign.id } }"
                    class="btn btn-sm btn-flex btn-light-primary"
                  >
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="/media/icons/duotune/art/art005.svg" />
                    </span>
                    Edit
                  </router-link>
                </td>
              </tr>
            </tbody>
            <div v-if="loading" class="overlay-layer card-rounded bg-dark bg-opacity-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </table>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-6">
        <div>
          <label>
            <select class="form-select form-select-sm form-select-solid" :value="limit" @change="changeLimit">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <div>
          <el-pagination
            :current-page="page"
            :total="total"
            :hide-on-single-page="false"
            @current-change="changePage"
            layout="prev, pager, next"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import BigNumber from 'bignumber.js'
import { defineComponent, ref } from 'vue'
import { timeToText } from './common/helpers/time.helper'
import ModalAddCampaign from './component/ModalAddCampaign.vue'
import { Campaign, CampaignService, CampaignType } from './module/campaign'
import { RewardRule } from './module/reward-rule'

export default defineComponent({
  name: 'kt-campaign-list',
  components: { ModalAddCampaign },
  setup() {
    return {
      campaigns: ref<Campaign[]>([]),
      loading: ref<boolean>(false),
      prices: ref<{ currency: string; price: string }[]>([]),
      page: ref(1),
      total: ref(0),
      limit: ref(10),
      searchText: ref(''),
      sort: ref(''),
      sortType: ref<'ASC' | 'DESC' | ''>(''),

      modalAddCampaign: ref<InstanceType<typeof ModalAddCampaign>>(),

      CampaignType,

      timeToText,
      BigNumber,
    }
  },
  mounted() {
    this.getData()
    store.dispatch(Actions.SET_BREADCRUMB_ACTION, {
      title: this.$t('campaignList'),
      pageBreadcrumbPath: ['menu.marketingFunctions'],
    })
  },
  methods: {
    async getData() {
      this.loading = true
      const result = await CampaignService.pagination({
        page: this.page,
        limit: this.limit || 10,
        search_field: 'title',
        search_text: this.searchText,
        sort: this.sort,
        sort_type: this.sortType,
      })
      this.campaigns = result.data || []
      this.prices = result.prices
      this.total = result.pagination.total
      this.loading = false
    },

    calculatorRelease(rewardRules: RewardRule[], key: 'balance' | 'reward' | 'cashback') {
      if (rewardRules.length === 0) return 'N/A'

      return (
        rewardRules
          .reduce((acc: BigNumber, cur: RewardRule) => {
            if (cur.key !== key) return acc
            if (cur.currency === 'USDT') return acc.plus(cur.releaseValue)

            const price = this.prices.find((i) => i.currency === cur.currency)
            if (!price) return acc.plus(cur.releaseValue)

            const budget = new BigNumber(cur.releaseValue).multipliedBy(price.price)
            return acc.plus(budget)
          }, new BigNumber(0))
          .toFormat(2) + ' (USDT)'
      )
    },

    changeLimit(event: Event) {
      const target = event.target as HTMLSelectElement
      this.limit = Number(target.value)
      this.page = 1
      this.getData()
    },
    changePage(page: number) {
      this.page = page
      this.getData()
    },
    changeSort(sortField: string) {
      this.sort = sortField
      if (this.sortType == 'DESC') {
        this.sort = ''
        this.sortType = ''
      } else if (this.sortType == 'ASC') {
        this.sortType = 'DESC'
      } else {
        this.sortType = 'ASC'
      }
      this.getData()
    },
    sortClass(column: string) {
      return [
        'sorting cursor-pointer',
        this.sort === column && this.sortType === 'ASC' && 'sorting_asc',
        this.sort === column && this.sortType === 'DESC' && 'sorting_desc',
      ]
    },
    startSearch() {
      this.page = 1
      this.getData()
    },

    handleModalSuccess() {
      console.log('success')
    },
  },
})
</script>

<style lang="scss" scoped>
table {
  position: relative;

  td {
    max-width: 400px;
    line-height: 2;
    padding: 20px 10px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .overlay-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
