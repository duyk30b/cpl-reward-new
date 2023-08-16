<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.botSetting') }}
      </div>

      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <!--begin::Register trading pair-->
          <button
            type="button"
            class="btn btn-primary"
            @click="openAddUserModal()"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('setting.addUserBot') }}
          </button>
          <!--end::Register trading pair-->
        </div>
        <!--end::Toolbar-->
      </div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" ref="tradingTable">
        <template v-slot:cell-status="{ row: item }">
          <div class="d-inline-flex flex-wrap">
            <span
              class="m-1"
              :class="{
                'badge badge-success': item.status == statusEnum.ACTIVE,
                'badge badge-danger': item.status == statusEnum.IN_ACTIVE,
              }"
              >{{ statusMap[item.status] }}</span
            >
          </div>
        </template>
        <template v-slot:cell-action="{ row: item }">
          <a
            v-if="item.status == 1"
            class="btn btn-sm btn-primary"
            @click="openEditUserModal(item)"
            target="_blank"
          >
            {{ $t('setting.changeUser') }}
          </a>
          <a
            v-else
            class="btn btn-sm btn-primary"
            @click="openActiveUserModal(item)"
            target="_blank"
          >
            {{ $t('setting.active') }}
          </a>
        </template>
      </datatable>
    </div>
  </div>
  <AddUserModal
    v-if="showAdd"
    :show="showAdd"
    @updated="refreshTable"
    @close="closeAddModal"
  />
  <EditUserModal
    v-if="showEdit"
    :show="showEdit"
    :editUser="editUser"
    @updated="refreshTable"
    @close="closeEditModal"
  />
  <ActiveUserModal
    v-if="showActive"
    :activeUser="activeUser"
    :show="showActive"
    @updated="refreshTable"
    @close="closeActiveModal"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import CONFIG from '@/config'
import {
  BOT_STATUS,
  BOT_STATUS_ENUM,
  BOT_TYPE,
} from '@/models/setting-exchange/BotSetting'
import AddUserModal from './modal/AddUserBotModal.vue'
import EditUserModal from './modal/EditUserBotModal.vue'
import ActiveUserModal from './modal/ActiveUserBotModal.vue'

export default defineComponent({
  name: 'bot-setting',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.botSetting', ['setting.setting'])
  },
  components: {
    Datatable,
    AddUserModal,
    EditUserModal,
    ActiveUserModal,
  },
  data() {
    return {
      showAdd: false,
      showEdit: false,
      showActive: false,
      statusMap: BOT_STATUS,
      statusEnum: BOT_STATUS_ENUM,
      editUser: {},
      activeUser: {},
      tableConfig: {
        dataSource: (params) => SettingExchangeService.getBotList(params),
        columns: [
          {
            key: 'user_id',
            title: 'setting.userId',
            sortable: false,
            class: 'td-w-150px text-center',
          },
          {
            key: 'email',
            title: 'setting.email',
            sortable: false,
            class: 'td-w-250px text-center',
          },
          {
            key: 'user_type',
            title: 'setting.userType',
            sortable: false,
            class: 'td-w-250px text-center',
            render: (value) => {
              return BOT_TYPE[value]
            },
          },
          {
            key: 'created_at',
            title: 'setting.createdAt',
            sortable: false,
            class: 'td-w-350px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm:ss')
            },
          },
          {
            key: 'status',
            title: 'setting.status',
            class: 'td-w-250px text-center',
            sortable: false,
          },
          {
            key: 'action',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            key: 'user_type',
            title: 'User type',
            searchType: DatatableSearchType.SELECT,
            remote: false,
            options: [
              {
                id: 2,
                name: 'Bot_A',
              },
              {
                id: 3,
                name: 'Bot_P',
              },
              {
                id: 4,
                name: 'Gatekeeper',
              },
              {
                id: 5,
                name: 'Bot_MM',
              },
            ],
          },
          {
            key: 'email',
            title: 'Email or user ID',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        isRemoveSearch: false,
        configPage: true,
      } as ITableConfig,
      CONFIG,
    }
  },
  methods: {
    openAddUserModal() {
      this.showAdd = true
    },
    openEditUserModal(item) {
      this.editUser = item
      this.showEdit = true
    },
    openActiveUserModal(item) {
      this.activeUser = item
      this.showActive = true
    },
    refreshTable() {
      if (this.$refs.tradingTable) {
        ;(this.$refs.tradingTable as IDatatableContext).getData()
      }
    },
    closeAddModal() {
      this.showAdd = false
    },
    closeEditModal() {
      this.showEdit = false
    },
    closeActiveModal() {
      this.showActive = false
    },
  },
})
</script>
