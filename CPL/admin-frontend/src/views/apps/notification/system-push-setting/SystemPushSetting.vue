<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.systemPushNotificationSetting') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-is_active="{ row: item }">
          <el-switch
            v-model="item.is_active"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            :loading="loading.toggle[item.id]"
            :before-change="toggleActive(item)"
            :disabled="!checkPermission(Permission.SYSTEM_PUSH_SETTING_UPDATE)"
          />
        </template>
        <template v-slot:cell-action="{ row: item }">
          <button
            v-if="checkPermission(Permission.SYSTEM_PUSH_SETTING_UPDATE)"
            class="btn btn-sm btn-primary"
            @click="updateSetting(item)"
          >
            {{ $t('edit') }}
          </button>
        </template>
      </datatable>
    </div>
  </div>

  <update-system-push-setting-modal
    :show="modal.updateSetting"
    :settingId="currentSettingId"
    @close="modal.updateSetting = false"
    @submited="settingUpdated"
  >
  </update-system-push-setting-modal>
</template>

<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { checkPermission, setPageFliud } from '@/core/helpers/common.helper'
import { SystemPushSettingService } from '@/services/SystemPushSettingService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Permission } from '@/core/variables/common.enum'
import { useI18n } from 'vue-i18n'
import UpdateSystemPushSettingModal from './UpdateSystemPushSettingModal.vue'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.systemPushNotificationSetting', [
      'menu.notification',
    ])
  },
  components: {
    Datatable,
    UpdateSystemPushSettingModal,
  },
  computed: {
    lang() {
      const i18n = useI18n()
      return i18n.locale.value
    },
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) =>
          SystemPushSettingService.getListSettings({
            ...params,
            lang: this.lang,
          }),
        columns: [
          {
            key: 'type',
            title: 'type',
            class: 'td-w-250px',
          },
          {
            key: 'title',
            title: 'title',
            sortable: true,
            class: 'td-w-250px',
            render: (value) => {
              return value[this.lang]
            },
          },
          {
            key: 'content',
            title: 'content',
            sortable: true,
            class: 'td-w-500px',
            render: (value) => {
              return value[this.lang]
            },
          },
          {
            key: 'is_active',
            title: 'active',
            class: 'text-center',
            sortable: true,
          },
          {
            title: 'action',
            key: 'action',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            title: 'title',
            key: 'title',
            searchType: DatatableSearchType.TEXT,
          },
          {
            title: 'content',
            key: 'content',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      }
    },
  },
  data() {
    return {
      tableReloadKey: 0,
      loading: {
        toggle: {},
      },
      modal: {
        updateSetting: false,
      },
      currentSettingId: null,
      Permission,
    }
  },
  methods: {
    toggleActive(setting) {
      return () => {
        this.loading.toggle[setting.id] = true
        return new Promise((resolve, reject) => {
          SystemPushSettingService.toggleActive(setting.id, !setting.is_active)
            .then((res) => {
              if (res.success) {
                this.$toastr.success(this.$t('success'))
                resolve(true)
              } else {
                this.$toastr.error(this.$t(res.message || 'serverError'))
                reject(1)
              }
            })
            .finally(() => {
              this.loading.toggle[setting.id] = false
            })
        })
      }
    },
    updateSetting(setting) {
      this.modal.updateSetting = true
      this.currentSettingId = setting.id
    },
    settingUpdated() {
      this.modal.updateSetting = false
      this.tableReloadKey++
    },
    checkPermission,
  },
})
</script>
