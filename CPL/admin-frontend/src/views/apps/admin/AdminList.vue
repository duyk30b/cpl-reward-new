<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.accounts') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:button>
          <button
            v-if="checkPermission(Permission.ADMIN_CREATE)"
            class="btn btn-primary me-2 mb-1"
            @click="showAdminCreateModal = true"
            :title="$t('create')"
          >
            <i class="fas fa-plus"></i>
            <span class="d-none d-lg-inline-block">{{ $t('create') }}</span>
          </button>
        </template>
        <template v-slot:cell-role_entities="{ row: row }">
          <template v-if="row.role_entities?.length">
            <div class="role" v-for="role in row.role_entities" :key="role.id">
              {{ role.name }}
            </div>
          </template>
          <div v-if="!row.role_entities?.length" class="text-grey">
            {{ $t('noData') }}
          </div>
        </template>
        <template v-slot:cell-action="{ row: row }">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{ name: 'admin.permission', params: { id: row.id } }"
          >
            {{ $t('permissions') }}
          </router-link>
        </template>
      </datatable>
    </div>
  </div>
  <admin-create
    :show="showAdminCreateModal"
    @close="showAdminCreateModal = false"
    @adminCreated="refreshTable"
  ></admin-create>
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
import { AdminService } from '@/services/AdminService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Permission } from '@/core/variables/common.enum'
import AdminCreate from '@/views/apps/admin/AdminCreate.vue'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.accounts', [])
  },
  components: {
    Datatable,
    AdminCreate,
  },
  data() {
    return {
      tableConfig: {
        dataSource: (params) => AdminService.getListAdmins(params),
        columns: [
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-350px',
          },
          {
            key: 'name',
            title: 'name',
            sortable: true,
            class: 'td-w-350px',
          },
          {
            key: 'role_entities',
            title: 'roles',
            class: 'td-w-350px',
          },
          {
            key: 'created_at',
            title: 'createdAt',
            sortable: true,
            class: 'td-w-350px',
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
            key: 'name',
            title: 'name',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
      showAdminCreateModal: false,
      Permission,
      tableReloadKey: 1,
    }
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },
    checkPermission,
  },
})
</script>

<style lang="scss" scoped>
.role {
  color: #fff;
  background-color: #50cd89;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px 5px 0;
}
</style>
