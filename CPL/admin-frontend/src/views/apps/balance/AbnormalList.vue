<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.balanceAbnormalList') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:cell-action="{ row: item }">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{
              name: 'user.detail',
              params: {
                id: item.userId,
                tab: 'balanceMonitoring',
              },
            }"
          >
            {{ $t('detail') }}
          </router-link>
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
import { checkPermission, setPageFliud } from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'
import { UserBalanceService } from '@/services/UserBalanceService'
import { UserService } from '@/services/UserService'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.basicInfo', ['users'])
  },
  components: {
    Datatable,
  },
  data() {
    return {
      softReloadKey: 0,
      tableReloadKey: 0,
      tableConfig: {
        dataSource: (params) =>
          UserBalanceService.getAbnormalBalanceUsers({
            ...params,
            size: params.per_page || 25,
          }),
        columns: [
          {
            key: 'userId',
            title: 'userId',
            sortable: false,
          },
          {
            key: 'email',
            title: 'email',
            sortable: false,
          },
          {
            title: 'action',
            key: 'action',
            class: 'td-w-250px text-center',
          },
        ],
        searchColumns: [
          {
            key: 'userIds',
            title: this.$t('email'),
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async function (text) {
              const result = await UserService.getListUsers({
                search_field: 'email',
                search_text: text.trim(),
              })
              return result?.data?.data.map((item) => ({
                id: item.user_id,
                name: item.email,
              }))
            },
            multiple: true,
            reserveKeyword: true,
            collapseTags: true,
          },
        ],
        configPage: true,
        configColumn: true,
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
