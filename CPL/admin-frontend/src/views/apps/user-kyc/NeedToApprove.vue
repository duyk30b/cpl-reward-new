<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t(`menu.needToApprove.${$route.params.kycType}`) }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom mb-6"
        role="tablist"
      >
        <li class="nav-item" v-for="(filter, tab) in tabs" :key="tab">
          <a
            class="nav-link text-uppercase"
            :class="{ active: tab == currentTab }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseTab(tab)"
            role="tab"
          >
            {{ $t(`needToApproveTabs.${tab}`) }}
          </a>
        </li>
      </ul>
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        @changeCheckBoxBanned="changeCheckBoxBanned"
      >
        <template v-slot:cell-action="{ row: user }">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{ name: reviewRoute(user), query: { user_id: user.user_id } }"
          >
            {{ $t('detail') }}
          </router-link>
          <ban-btn
            :userId="user.user_id"
            :isBanned="user.is_banned"
            @banStatusChange="softRefreshTable"
          ></ban-btn>
        </template>
        <template v-slot:cell-is_banned="{ row: user }">
          <span
            class="badge"
            :class="{
              'badge-light-success d-none': !user.is_banned,
              'badge-light-danger': user.is_banned,
            }"
            >{{ user.is_banned ? $t('ban') : $t('unban') }}</span
          >
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
  SortType,
} from '@/components/datatable/Datatable.vue'
import {
  checkPermission,
  convertTimestampToDate,
  getEnumValues,
  parseAccountLevelStatus,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { UserService } from '@/services/UserService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { KycStatus, RiskRating } from '@/models/user/UserKyc'
import { ChannelService } from '@/services/ChannelService'
import { Permission } from '@/core/variables/common.enum'
import { UserStatus } from '@/models/user/User'
import BanBtn from '@/components/user/BanBtn.vue'

export enum NeedToApproveTabs {
  REVIEW_OCR = 'reviewOcr',
  REVIEW_OCR_PENDING = 'reviewOcrPending',
  REVIEW_RISK = 'reviewRisk',
  REVIEW_RISK_PENDING = 'reviewRiskPending',
}

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs(
      `menu.needToApprove.${this.$route.params.kycType}`,
      ['users'],
    )
    const tabQuery = this.$route.query.tab as NeedToApproveTabs
    if (tabQuery && this.tabs[tabQuery]) {
      this.chooseTab(tabQuery)
    }
  },
  watch: {
    '$route.params.kycType': function () {
      setCurrentPageBreadcrumbs(
        `menu.needToApprove.${this.$route.params.kycType}`,
        ['users'],
      )
      this.refreshTable()
    },
  },
  components: {
    Datatable,
    BanBtn,
  },
  data() {
    return {
      tabs: {
        [NeedToApproveTabs.REVIEW_OCR]: {
          kyc_status: KycStatus.AUTO_KYC_PROCESSED,
        },
        [NeedToApproveTabs.REVIEW_OCR_PENDING]: {
          kyc_status: KycStatus.PENDING_PAPER,
        },
        [NeedToApproveTabs.REVIEW_RISK]: {
          kyc_status: KycStatus.APPROVED_PAPER,
        },
        [NeedToApproveTabs.REVIEW_RISK_PENDING]: {
          kyc_status: KycStatus.PENDING,
        },
      },
      currentTab: NeedToApproveTabs.REVIEW_OCR,
      tableReloadKey: 0,
      tableConfig: {
        dataSource: (params) => {
          return UserService.getListUsers({
            ...params,
            ...this.currentFilter,
            ...this.showBannedFilter,
            kyc_type: this.$route.params.kycType,
          })
        },
        columns: [
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'full_name',
            title: 'userName',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'account_lv',
            title: 'accountLevel',
            class: 'text-center td-w-100px min-w-100px',
            sortable: true,
          },
          {
            key: 'level_status',
            title: 'levelStatus',
            sortable: true,
            render: (levelStatus, row) => {
              return parseAccountLevelStatus(row.account_lv, row.kyc_status)
            },
          },
          {
            key: 'gg_id',
            title: 'ggId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'fb_id',
            title: 'fbId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'apple_id',
            title: 'appleId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'account_status',
            title: 'accountStatus',
            sortable: true,
            hidden: true,
            render: (value) => {
              return this.$t(`accountStatusValue.${value}`)
            },
          },
          {
            key: 'authenticator_verify_status',
            title: 'set2FA',
            sortable: true,
            render: (value) => {
              return this.$t(`authenticatorVerifyStatusValue.${value}`)
            },
          },
          {
            key: 'created_at',
            title: 'registeredDate',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'kyc_submitted_date',
            title: 'submissionDate',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'last_login',
            title: 'lastLogin',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'risk_rating',
            title: 'riskRating',
            class: 'min-w-100px',
            sortable: true,
            render: (value) => {
              return value ? this.$t(`riskRatingValue.${value}`) : ''
            },
          },
          {
            key: 'registered_channel',
            title: 'registeredChannel',
            class: 'td-w-150px min-w-100px',
            sortable: true,
          },
          {
            key: 'referral_email',
            title: 'referralEmail',
            class: 'td-w-250px min-w-100px',
            sortable: true,
          },
          {
            key: 'referral_gg_id',
            title: 'referralGgId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'referral_fb_id',
            title: 'referralFbId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'referral_apple_id',
            title: 'referralAppleId',
            sortable: true,
            class: 'td-w-250px',
            hidden: true,
          },
          {
            key: 'is_banned',
            title: 'bannedStatus',
            class: 'min-w-100px text-center',
            hiddenTitle: true,
          },
          {
            title: 'action',
            key: 'action',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            key: 'risk_rating',
            title: 'riskRating',
            searchType: DatatableSearchType.SELECT,
            options: [
              RiskRating.LOW,
              RiskRating.MEDIUM,
              RiskRating.HIGH,
              RiskRating.SCREENING,
              RiskRating.FAIL_INFO,
              RiskRating.UNKNOWN,
            ].map((e) => ({
              id: e,
              name: this.$t(`riskRatingValue.${e}`),
            })),
          },
          {
            key: 'registered_channel',
            title: 'registeredChannel',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async (text) => {
              const result = await ChannelService.getChannelList({
                search_field: 'name',
                search_text: text,
              })
              return result?.data?.data
            },
          },
          {
            key: 'account_status',
            title: 'accountStatus',
            searchType: DatatableSearchType.SELECT,
            options: getEnumValues(UserStatus).map((e) => ({
              id: e,
              name: this.$t(`accountStatusValue.${e}`),
            })),
          },
          {
            key: 'email',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'referral_email',
            title: 'referralEmail',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        default: {
          sort: 'kyc_submitted_date',
          sortType: SortType.DESC,
          searchField: 'email',
        },
        configPage: true,
        configColumn: true,
      } as ITableConfig,
      Permission,
      showBanned: 0,
    }
  },
  computed: {
    currentFilter(): Record<string, any> {
      return this.tabs[this.currentTab] || {}
    },
    showBannedFilter(): Record<string, any> {
      return { is_banned: this.showBanned }
    },
  },
  methods: {
    changeCheckBoxBanned(data) {
      this.showBanned = data.checked ? 2 : 0
      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
    chooseTab(tab) {
      if (this.currentTab == tab) return
      if (!this.tabs[tab]) return
      this.currentTab = tab
      this.$router.replace({ query: { tab } })
      this.refreshTable()
    },
    reviewRoute(user) {
      if (
        user.kyc_status == KycStatus.AUTO_KYC_PROCESSED ||
        user.kyc_status == KycStatus.PENDING_PAPER
      ) {
        return 'userKyc.reviewOcr'
      }
      if (
        user.kyc_status == KycStatus.APPROVED_PAPER ||
        user.kyc_status == KycStatus.PENDING
      ) {
        return 'userKyc.reviewRisk'
      }
    },
    checkPermission,
  },
})
</script>
