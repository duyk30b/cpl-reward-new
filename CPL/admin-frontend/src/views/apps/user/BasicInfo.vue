<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.basicInfo') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:cell-action="{ row: user }">
          <a
            class="btn btn-sm btn-primary me-1"
            :href="`${CONFIG.ADMIN_V2_URL}admin/users/user-info-registrant/${user.user_id}/view`"
            target="_blank"
          >
            {{ $t('detail') }} v2
          </a>
          <router-link
            class="btn btn-sm btn-primary me-1"
            :to="{ name: 'user.detail', params: { id: user.user_id } }"
          >
            {{ $t('detail') }} v3
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
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'
import { UserStatus } from '@/models/user/User'
import BanBtn from '@/components/user/BanBtn.vue'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.basicInfo', ['users'])
  },
  components: {
    Datatable,
    BanBtn,
  },
  data() {
    return {
      softReloadKey: 0,
      tableReloadKey: 0,
      tableConfig: {
        dataSource: (params) => UserService.getListUsers(params),
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
            key: 'referral_email',
            title: 'referralEmail',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'user_info_status',
            title: 'registeredInformation',
            sortable: true,
            render: (value) => {
              return this.$t(`userInfoStatusValue.${value}`)
            },
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
          // {
          //   key: 'social_link',
          //   title: 'socialLink',
          //   sortable: true,
          //   render: (value) => {
          //     return this.$t(`socialLinkValue.${value}`)
          //   },
          // },
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
            render: (value) => {
              return value
                ? convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
                : ''
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
            options: ['1', '2', '3.1', '3.2', '3.3', '4'].map((e) => ({
              id: e,
              name: `${this.$t(`level`)} ${parseInt(e)}: ${this.$t(
                `levelStatusValue.${e}`,
              )}`,
            })),
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
        configPage: true,
        configColumn: true,
        activeExport: checkPermission(Permission.USER_EXPORT),
        getExport: () => UserService.getUsersExport(),
        createExport: (params) => UserService.createUsersExport(params),
        default: {
          searchField: 'email',
        },
      } as ITableConfig,
      Permission,
      CONFIG,
    }
  },
  methods: {
    checkPermission,
    refreshTable() {
      this.tableReloadKey++
    },
    softRefreshTable() {
      this.softReloadKey++
    },
  },
})
</script>
