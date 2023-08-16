<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.appVersion') }}
      </div>

      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          class="d-flex justify-content-end"
          data-kt-campaign-table-toolbar="base"
        >
          <!--begin::Register trading pair-->
          <button
            @click="openEditModal()"
            type="button"
            class="btn btn-primary"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('setting.registerAppVersion') }}
          </button>
          <!--end::Register trading pair-->
        </div>
        <!--end::Toolbar-->
      </div>
    </div>
    <div class="card-body pt-0">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom mb-10"
        role="tablist"
      >
        <li class="nav-item" v-for="tab of tabs" :key="tab.id">
          <a
            class="nav-link text-uppercase"
            :class="{ active: tab.id == currentTab }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseTab(tab)"
            role="tab"
          >
            {{ tab.name }}
          </a>
        </li>
      </ul>
      <table class="table align-middle fs-6 gy-5 table-bordered common-table">
        <thead>
          <tr>
            <th>{{ $t('appVersion.platform') }}</th>
            <th>{{ $t('appVersion.version') }}</th>
            <th>{{ $t('appVersion.releaseDate') }}</th>
            <th>{{ $t('appVersion.changeLog') }}</th>
            <th>{{ $t('appVersion.forceUpdate') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ver of versionData" :key="ver">
            <td class="text-center">{{ ver.platform }}</td>
            <td class="text-center">{{ ver.version }}</td>
            <td class="text-center">
              {{
                $filters.convertDateFormat(Date.parse(ver.release_date), 'x')
              }}
            </td>
            <td class="text-center change_log">
              <div>{{ ver.change_log }}</div>
            </td>
            <td class="text-center">
              {{ ver.force_update }}
            </td>
            <td class="text-center">
              <a @click="openEditModal(ver)" class="btn btn-sm btn-primary"
                >Detail</a
              >
              <button
                style="margin-left: 2px"
                class="btn btn-sm btn-danger"
                @click="deleteAppVersion(ver)"
              >
                <span class="d-none d-md-inline-block">
                  {{ $t('delete') }}
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EditAppVersion
      v-if="showEdit"
      :show="showEdit"
      :isNew="isNew"
      :ver="appVersion"
      @updated="refreshTable"
      @close="closeEditModal"
    />
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import { PlatformItem } from '@/models/setting-exchange/AppVersion'
import { HttpStatus } from '@/core/variables/common.enum'
import EditAppVersion from '@/components/app/EditAppVersion.vue'
import { AppVersionService } from '@/services/AppVersionService'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'app-version',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.appVersion', ['setting.setting'])
    this.getVersionList()
  },
  components: { EditAppVersion },
  data() {
    return {
      showEdit: false,
      isNew: false,
      currentTab: 'ios',
      appVersion: {} as PlatformItem,
      versionData: [] as PlatformItem[],
      tabs: [
        {
          id: 'ios',
          name: 'iOS',
        },
        {
          id: 'android',
          name: 'android',
        },
      ],
    }
  },
  methods: {
    chooseTab(tab) {
      this.currentTab = tab.id
      this.getVersionList()
    },
    async getVersionList() {
      const dataVer = await AppVersionService.getAppVersion(this.currentTab)
      if (dataVer.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.error'))
        this.versionData = []
        return
      }
      this.versionData = dataVer.data
    },
    openEditModal(ver?) {
      this.showEdit = true
      this.isNew = !ver
      this.appVersion = ver
    },
    refreshTable() {
      this.getVersionList()
    },
    closeEditModal() {
      this.appVersion = {} as PlatformItem
      this.showEdit = false
    },
    async deleteAppVersion(ver) {
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: this.$t('appVersion.confirmDelete'),
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (!result.isConfirmed) return

        const cancelledOrders = await AppVersionService.deleteAppVersion(ver)
        if (cancelledOrders.status != HttpStatus.OK) {
          this.$toastr.error(this.$t('appVersion.deleteFailed'))
          return
        }
        this.$toastr.success(this.$t('appVersion.deleteSuccess'))
        setTimeout(() => {
          this.refreshTable()
        }, 1000)
      })
    },
  },
})
</script>
<style lang="scss" scoped>
.change_log {
  max-width: 300px;
}
</style>
