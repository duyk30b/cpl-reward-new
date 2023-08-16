<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <inline-svg src="media/icons/duotune/general/gen021.svg" />
          </span>
          <input
            type="text"
            data-kt-campaign-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            :placeholder="$t('searchCampaigns')"
            @input="searchText"
            maxlength="255"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          class="d-flex justify-content-end"
          data-kt-campaign-table-toolbar="base"
        >
          <!--begin::Export
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_campaigns_export_modal"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr078.svg" />
            </span>
            Export
          </button>
          end::Export-->

          <!--begin::Add campaign-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_campaign"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('addCampaign') }}
          </button>
          <!--end::Add campaign-->
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-campaign-table-toolbar="selected"
        >
          <div class="fw-bolder me-5">
            <span
              class="me-2"
              data-kt-campaign-table-select="selected_count"
            ></span>
            {{ $t('selected') }}
          </div>

          <button
            type="button"
            class="btn btn-danger"
            data-kt-campaign-table-select="delete_selected"
          >
            {{ $t('deleteSelected') }}
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable
        :table-data="items"
        :table-header="headerConfig"
        :enable-items-per-page-dropdown="true"
        :rows-per-page="campaignFilter.limit"
        :current-page="campaignFilter.page"
        :total="totalItems"
        :loading="loading"
        :sortLabel="campaignFilter.sort"
        :order="campaignFilter.sortType"
        @current-change="changePage"
        @sort="changeSort"
        @items-per-page-change="changeItemPerPage"
        :key="tableRenderCount"
      >
        <template v-slot:cell-id="{ row: campaign }">
          {{ campaign.id }}
        </template>
        <template v-slot:cell-type="{ row: campaign }">
          {{ campaign.type }}
        </template>
        <template v-slot:cell-checkbox="{ row: campaign }">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="campaign.id"
              v-model="checkedCampaigns"
            />
          </div>
        </template>
        <template v-slot:cell-title="{ row: campaign }">
          <router-link
            :to="'/campaign/detail/' + campaign.id"
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ campaign.title }}
          </router-link>
        </template>
        <template v-slot:cell-status="{ row: campaign }">
          <div v-if="campaign.isActive === 0">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="$t(`campaignStatus.` + CampaignStatus.INACTIVE)"
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
              'badge-success': campaign.status === CampaignStatus.RUNNING,
              'badge-warning': campaign.status === CampaignStatus.OUT_OF_BUDGET,
              'badge-danger': campaign.status === CampaignStatus.ENDED,
              'badge-primary': campaign.status === CampaignStatus.COMING_SOON,
            }"
          >
            {{ $t(`campaignStatus.${campaign.status}`) }}
          </div>
        </template>
        <template v-slot:cell-endDate="{ row: campaign }">
          {{ moment.unix(campaign.endDate).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:cell-startDate="{ row: campaign }">
          {{ moment.unix(campaign.startDate).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:cell-cashback="{ row: campaign }">
          {{ displayBudget('cashback', campaign) }}
        </template>
        <template v-slot:cell-balance="{ row: campaign }">
          {{ displayBudget('balance', campaign) }}
        </template>
        <template v-slot:cell-reward="{ row: campaign }">
          {{ displayBudget('reward', campaign) }}
        </template>
        <!--<template v-slot:cell-dividend="{ row: campaign }">
          {{ displayBudget('dividend_limit', campaign) }}
        </template>
        -->
        <template v-slot:cell-createdAt="{ row: campaign }">
          {{ moment.unix(campaign.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:cell-priority="{ row: campaign }">
          {{ campaign.priority }}
        </template>
        <template v-slot:cell-action="{ row: campaign }">
          <router-link
            :to="{
              name: 'campaign.detail',
              params: { id: campaign.id },
            }"
            class="btn btn-sm btn-flex btn-light-primary"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/art/art005.svg" />
            </span>
            Edit
          </router-link>
        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
    <AddCampaignModal></AddCampaignModal>
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import KTDatatable from '@/components/kt-datatable/KTDatatable.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import ApiService from '@/core/services/ApiService'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import Campaign, {
  Price,
  CampaignFilter,
  CampaignStatus,
} from '@/core/data/campaign/campaign'
import moment from 'moment'
import AddCampaignModal from '@/components/campaigns/add/AddCampaignModal.vue'
import { FixedNumber } from 'ethers'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'kt-campaign-list',
  components: {
    AddCampaignModal,
    KTDatatable,
  },
  methods: {
    changeSort(newSort) {
      this.campaignFilter.sort = newSort.columnName
      this.campaignFilter.sortType = newSort.order
      this.getItems()
    },
    changeItemPerPage(perPage) {
      this.campaignFilter.page = 1
      this.campaignFilter.limit = perPage
      this.getItems()
    },
    searchText(input) {
      clearTimeout(this.debounceSearch)
      this.debounceSearch = window.setTimeout(() => {
        this.campaignFilter.searchText = input.target.value
        this.getItems()
      }, 300)
    },
    displayBudget(budgetKey, campaign: Campaign) {
      if (!campaign.rewardRules) {
        return 'N/A'
      }
      const rules = campaign.rewardRules.filter(
        (x) => x.key == budgetKey && x.typeRule == 'mission',
      )
      if (rules.length === 0) {
        return 'N/A'
      }

      const releaseValue = rules.reduce((prev, cur) => {
        try {
          if (cur.currency === 'USDT') {
            return prev.addUnsafe(
              FixedNumber.from(cur.releaseValue, 'fixed256x26'),
            )
          }

          const price = this.prices.find(
            (price) => price.currency === cur.currency,
          )
          if (!price) {
            return prev.addUnsafe(
              FixedNumber.from(cur.releaseValue, 'fixed256x26'),
            )
          }

          const curReleaseValue = FixedNumber.from(
            cur.releaseValue,
            'fixed256x26',
          ).mulUnsafe(FixedNumber.from(price.price, 'fixed256x26'))
          return prev.addUnsafe(curReleaseValue)
        } catch (error) {
          console.log(error)
          return FixedNumber.from('0', 'fixed256x26')
        }
      }, FixedNumber.from('0', 'fixed256x26'))

      return releaseValue.round(2).toString() + ' (USDT)'
    },
    checkedCampaigns() {
      return
    },
    deleteCampaign() {
      return
    },
    changePage(newPage) {
      this.campaignFilter.page = newPage
      this.getItems()
    },
    async getItems() {
      this.loading = true
      const events = await ApiService.get('/campaign', {
        params: {
          page: this.campaignFilter.page,
          limit: this.campaignFilter.limit,
          search_field: 'title',
          search_text: this.campaignFilter.searchText,
          sort: this.campaignFilter.sort,
          sort_type: this.campaignFilter.sortType
            ? this.campaignFilter.sortType.toString().toUpperCase()
            : '',
        },
      }).catch((e) => {
        console.log(e)
      })

      this.loading = false

      if (events && events.data) {
        this.items.splice(0, this.items.length)
        const data = instanceToPlain(events.data)

        if (data.data) {
          this.prices = data.prices.map((price) =>
            plainToInstance(Price, price),
          )
          this.items = data.data.map((campaign) => {
            // if (!campaign.is_active) {
            //   campaign.status = CampaignStatus.INACTIVE
            // }
            return plainToInstance(Campaign, campaign)
          })
        }

        this.campaignFilter.page = data.pagination.page
        this.campaignFilter.limit = data.pagination.size
        this.totalItems = data.pagination.total

        this.tableRenderCount++
      }
    },
  },
  data() {
    const campaignFilter = new CampaignFilter()
    campaignFilter.limit = 10

    return {
      debounceSearch: 0,
      moment,
      items: [] as Campaign[],
      totalItems: 0,
      loading: true,
      campaignFilter,
      tableRenderCount: 0,
      CampaignStatus: CampaignStatus,
      prices: [] as Array<Price>,
    }
  },
  mounted() {
    this.getItems()
  },
  setup() {
    const { t } = useI18n()

    const headerConfig = ref([
      {
        key: 'checkbox',
        sortable: false,
      },
      {
        name: t('id'),
        key: 'id',
        sortable: true,
        className: 'mw-150px',
      },
      {
        name: t('campaignName'),
        key: 'title',
        sortable: true,
        className: 'mw-200px',
      },
      {
        name: t('type'),
        key: 'type',
        sortable: false,
        className: 'mw-150px',
      },
      {
        name: t('status'),
        key: 'status',
        sortable: true,
      },
      {
        name: t('startDate'),
        key: 'startDate',
        sortingField: 'start_date',
        sortable: true,
      },
      {
        name: t('endDate'),
        key: 'endDate',
        sortingField: 'end_date',
        sortable: true,
      },
      {
        name: t('releasedCashback'),
        key: 'cashback',
        sortable: false,
      },
      {
        name: t('releasedRealBalance'),
        key: 'balance',
        sortable: false,
      },
      {
        name: t('releasedRealReward'),
        key: 'reward',
        sortable: false,
      },
      // {
      //   name: 'Budget Dividend',
      //   key: 'dividend',
      //   sortable: false,
      // },
      {
        name: t('priority'),
        key: 'priority',
        sortable: true,
      },
      {
        name: t('createdAt'),
        key: 'createdAt',
        sortingField: 'created_at',
        sortable: true,
      },
      {
        name: t('action'),
        key: 'action',
        sortable: false,
      },
    ])

    onMounted(() => {
      setCurrentPageBreadcrumbs(t('campaignList'), ['menu.marketingFunctions'])
    })

    return {
      headerConfig,
    }
  },
})
</script>
