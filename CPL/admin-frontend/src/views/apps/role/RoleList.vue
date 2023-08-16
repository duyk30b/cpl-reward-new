<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.roles') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig">
        <template v-slot:button>
          <router-link
            v-if="checkPermission(Permission.ROLE_CREATE)"
            class="btn btn-primary me-2 mb-1"
            :to="{ name: 'role.create' }"
            :title="$t('create')"
          >
            <i class="fas fa-plus"></i>
            <span class="d-none d-lg-inline-block">{{ $t('create') }}</span>
          </router-link>
        </template>
        <template v-slot:cell-action="{ row: row }">
          <router-link
            v-if="
              hasAllPermissions([Permission.ROLE_READ, Permission.ROLE_UPDATE])
            "
            class="btn btn-sm btn-primary"
            :to="{
              name: 'role.update',
              params: { id: row.id },
            }"
          >
            <i class="fas fa-pencil-alt pe-0"></i>
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
import {
  checkPermission,
  convertTimestampToDate,
  hasAllPermissions,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { RoleService } from '@/services/RoleService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'

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
      Permission,
      tableConfig: {
        dataSource: (params) => RoleService.getListRoles(params),
        columns: [
          {
            key: 'id',
            title: 'id',
            class: 'text-center',
            sortable: true,
          },
          {
            key: 'name',
            title: 'name',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'description',
            title: 'description',
            sortable: true,
            class: 'td-w-500px min-w-300px',
          },
          {
            key: 'created_at',
            title: 'createdAt',
            sortable: true,
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
            key: 'name',
            title: 'name',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'description',
            title: 'description',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
      CONFIG,
    }
  },
  methods: {
    hasAllPermissions,
    checkPermission,
  },
})
</script>
