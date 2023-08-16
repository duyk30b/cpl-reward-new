<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('dividendScreen.disableDividendUser') }}
      </div>

      <div class="card-toolbar d-flex">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#disable-user-modal"
          @click.prevent="addDisableUser"
        >
          {{ $t('dividendScreen.createNew') }}
        </button>
      </div>
    </div>

    <div class="row mx-5 d-flex align-items-end">
      <div class="col-4">
        <label class="form-label">{{ $t('email') }} </label>

        <el-select
          v-model="querySearch.search_key"
          filterable
          clearable
          remote
          reserve-keyword
          :placeholder="$t('email')"
          remote-show-suffix
          :remote-method="getUsersRegistrant"
          :loading="remoteLoading"
        >
          <el-option
            v-for="user in users"
            :key="user.user_id"
            :label="user.email"
            :value="user.user_id"
          />
        </el-select>
      </div>

      <div class="col-2">
        <button
          class="btn btn-primary w-100"
          :disabled="searching"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!searching" class="fas fa-search fa-fw"></i>
          <i v-if="searching" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <div class="card-body pt-5">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="datatableRef"
      >
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>

        <template v-slot:cell-action="{ row: item }">
          <button class="btn btn-sm btn-danger" @click="deleteUser(item)">
            {{ $t('delete') }}
          </button>
        </template>
      </datatable>
      <disable-user
        @disableDividendUserSuccess="refreshTable"
        ref="disableUserRef"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import DisableUser from '@/views/dividend/components/DisableUser.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import { DividendService } from '@/views/dividend/services/DividendService'
import { formatUTCToLocalTime } from '@/core/helpers/util'
import { UserService } from '@/services/UserService'
import Swal from 'sweetalert2'
import { debounce } from 'lodash'

interface User {
  user_id: string
  email: string
}

export default defineComponent({
  name: 'Dividend List',
  components: {
    Datatable,
    DisableUser,
  },
  data() {
    return {
      searching: false as boolean,
      querySearch: {
        search_key: '',
      },
      tableReloadKey: 1,
      users: [] as User[],
      remoteLoading: false,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'dividendScreen.no',
            sortable: false,
            class: 'td-w-50px align-middle text-center',
          },
          {
            key: 'email',
            title: 'dividendScreen.email',
            sortable: false,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'created_at',
            title: 'dividendScreen.disableDate',
            sortable: true,
            render: (value) => {
              return formatUTCToLocalTime(value)
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'action',
            title: '',
            sortable: false,
            class: 'td-w-200px align-middle text-center',
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs('dividendScreen.disableDividendUser', [])
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      for (const [key, value] of Object.entries(this.querySearch)) {
        if (value) {
          queryObject[key] = value
        }
      }
      return queryObject
    },
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(params: any) {
      try {
        this.searching = true
        const { success, data } = await DividendService.getUsersDisableDividend(
          params,
        )
        this.searching = false
        if (success) {
          return {
            status: HttpStatus.OK,
            data: {
              data: data.data,
              pagination: {
                page: params.page,
                size: params.limit,
                total: data.pagination.total,
              },
            },
          }
        }
      } catch (err) {
        this.searching = false
      }
    },

    async onSearch() {
      this.refreshTable()
    },

    // reset form before open modal
    addDisableUser() {
      const disableUserRef = this.$refs.disableUserRef as any
      disableUserRef.beforeOpen()
    },

    async deleteUser(user) {
      const confirm = await Swal.fire({
        icon: 'question',
        text: this.$t('dividendScreen.confirmDeleteUser', {
          user: `${user.email}`,
        }),
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
      })
      if (confirm.isConfirmed) {
        const { success, data } =
          await DividendService.deleteDisableUserDividend(+user.id)
        if (success && data?.data?.success) {
          this.refreshTable()
          this.$toastr.success(this.$t('success'))
        } else {
          this.$toastr.error(this.$t('error'))
        }
      }
    },

    async getUsersRegistrant(query) {
      this.remoteLoading = true
      const data = await UserService.getListUsers({
        search_field: 'email',
        search_text: query,
      })
      this.remoteLoading = false
      this.users = data?.data?.data ?? []
    },
  },
  watch: {
    'querySearch.search_key': debounce(async function (
      this: any,
      newSearchKey,
    ) {
      if (!newSearchKey) {
        this.refreshTable()
      }
    },
    300),
  },
})
</script>
