<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.futuresSetting.user') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:cell-action="{ row: user }">
          <button class="btn btn-sm btn-warning" style="margin-left: 0.25em">
            {{ $t('delete') }}
          </button>
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
  setPageFliud,
} from '@/core/helpers/common.helper'
import { UserService } from '@/services/UserService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'
import BanBtn from '@/components/user/BanBtn.vue'

export default defineComponent({
  name: 'futures-user',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.futuresSetting.user', [
      'menu.futures.title',
    ])
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
            key: 'user_id',
            title: 'user_id',
            sortable: true,
            class: 'td-w-100px text-center',
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-300px',
          },
          {
            key: 'created_at',
            title: 'registeredDate',
            sortable: true,
            class: 'td-w-300px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
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
            key: 'email',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'user_id',
            title: 'userId',
            searchType: DatatableSearchType.TEXT,
          },
        ],
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
