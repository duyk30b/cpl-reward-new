<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.listAccountLv') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom mb-6"
        role="tablist"
      >
        <li class="nav-item pe-3">
          <a
            class="nav-link text-uppercase"
            :class="{ active: !currentAccountLv }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseLv()"
            role="tab"
          >
            {{ $t('all') }} {{ $t('level') }}
          </a>
        </li>
        <li class="nav-item" v-for="lv in [1, 2, 3, 4]" :key="lv">
          <a
            class="nav-link text-uppercase"
            :class="{ active: lv == currentAccountLv }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseLv(lv)"
            role="tab"
          >
            {{ $t('level') }} {{ lv }}
          </a>
        </li>
      </ul>
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        :soft-reload-key="softReloadKey"
      >
        <template v-slot:cell-action="{ row: user }">
          <router-link
            v-if="
              user.account_lv == 1 ||
              user.account_lv == 2 ||
              user.level_status == '3.1'
            "
            class="btn btn-sm btn-primary"
            :to="{ name: 'user.detail', params: { id: user.user_id } }"
          >
            {{ $t('detail') }}
          </router-link>
          <router-link
            v-else
            class="btn btn-sm btn-primary"
            :to="{
              name:
                user.kyc_status == KycStatus.AUTO_KYC_PROCESSED ||
                user.kyc_status == KycStatus.PENDING_PAPER
                  ? 'userKyc.reviewOcr'
                  : 'userKyc.reviewRisk',
              query: { user_id: user.user_id },
            }"
          >
            {{ $t('detail') }}
          </router-link>
          <ban-btn
            :userId="user.user_id"
            :isBanned="user.is_banned"
            @banStatusChange="softRefreshTable"
          ></ban-btn>
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
import { RiskRating, KycStatus } from '@/models/user/UserKyc'
import { ChannelService } from '@/services/ChannelService'
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'
import { UserStatus } from '@/models/user/User'
import BanBtn from '@/components/user/BanBtn.vue'

export default defineComponent({
  name: 'list-account-level',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.listAccountLv', ['users'])
    const lvQuery = this.$route.query.lv
    if (lvQuery) {
      this.chooseLv(lvQuery)
    }
  },
  components: {
    Datatable,
    BanBtn,
  },
  data() {
    return {
      softReloadKey: 0,
      tableReloadKey: 0,
      currentAccountLv: null,
      CONFIG,
      Permission,
      KycStatus,
    }
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) =>
          UserService.getListUsers({
            ...params,
            account_lv: this.currentAccountLv,
          }),
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
            sortable: true,
            class: 'td-w-250px min-w-100px',
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
            title: 'action',
            key: 'action',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            key: 'level_status',
            title: 'levelStatus',
            searchType: DatatableSearchType.SELECT,
            options: ['1', '2', '3.1', '3.2', '3.3', '4']
              .filter(
                (e) =>
                  !this.currentAccountLv ||
                  parseInt(e) == this.currentAccountLv,
              )
              .map((e) => ({
                id: e,
                name: `${this.$t(`level`)} ${parseInt(e)}: ${this.$t(
                  `levelStatusValue.${e}`,
                )}`,
              })),
          },
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
              id: e as any,
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
        configPage: true,
        configColumn: true,
        default: {
          searchField: 'email',
        },
      }
    },
  },
  methods: {
    checkPermission,
    refreshTable() {
      this.tableReloadKey++
    },
    softRefreshTable() {
      this.softReloadKey++
    },
    chooseLv(lv?) {
      if (this.currentAccountLv == lv) return
      this.currentAccountLv = lv
      this.$router.replace({ query: { lv } })
      this.refreshTable()
    },
  },
})
</script>
