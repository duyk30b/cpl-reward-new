<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('channelList') }}
      </div>

      <div class="card-toolbar">
        <button type="button" class="btn btn-primary" @click="openCreateModal">
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
          </span>
          {{ $t('addChannel') }}
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" ref="channelTable">
        <template v-slot:cell-tags="{ row: channel }">
          <div class="d-inline-flex flex-wrap">
            <span
              class="badge badge-success m-1"
              v-for="tag in channel.tags"
              :key="tag.id"
              >{{ tag.name }}</span
            >
          </div>
        </template>
        <template v-slot:cell-link="{ row: channel }">
          <input
            class="form-control"
            onclick="this.select()"
            :value="channel.link"
          />
        </template>
        <template v-slot:cell-dynamic_link="{ row: channel }">
          <input
            class="form-control"
            onclick="this.select()"
            :value="channel.dynamic_link"
          />
        </template>
        <template v-slot:cell-action="{ row: channel }">
          <div class="d-flex justify-content-around flex-wrap">
            <button
              class="btn btn-sm btn-primary"
              @click="openEditModal(channel)"
            >
              {{ $t('edit') }}
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="openDeleteModal(channel.id)"
            >
              {{ $t('delete') }}
            </button>
          </div>
        </template>
      </datatable>
    </div>
    <EditChannelModal
      v-if="showEdit"
      :show="showEdit"
      :channel="channelModal"
      @updated="refreshTable"
      @close="closeEditModal"
    />
    <ConfirmDeleteModal
      title="deleteChannel"
      confirm-message="deleteChannelConfirm"
      :show="showDelete"
      :delete-func="deleteChannel"
      :primary-key="pendingDeleteId"
      @deleted="refreshTable"
      @close="closeDeleteModal"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  ITableConfig,
  IDatatableContext,
} from '@/components/datatable/Datatable.vue'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import EditChannelModal from '@/components/channels/EditChannelModal.vue'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue'
import { ChannelService } from '@/services/ChannelService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { ChannelEntity } from '@/core/data/channel'
import { plainToClass } from 'class-transformer'

export default defineComponent({
  name: 'channel-list',
  components: {
    Datatable,
    EditChannelModal,
    ConfirmDeleteModal,
  },
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('channelList', ['menu.marketingFunctions'])
  },
  data() {
    return {
      showEdit: false,
      showDelete: false,
      pendingDeleteId: 0,
      channelModal: new ChannelEntity(),
      tableConfig: {
        columns: [
          {
            title: 'id',
            key: 'id',
            sortable: true,
            class: 'text-center td-w-50px',
          },
          {
            title: 'channelName',
            key: 'name',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            title: 'channelLink',
            key: 'link',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            title: 'channelDynamicLink',
            key: 'dynamic_link',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            title: 'tag',
            key: 'tags',
            sortable: false,
          },
          {
            title: 'createDate',
            key: 'created_at',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD')
            },
          },
          {
            title: 'action',
            key: 'action',
            sortable: false,
            class: 'td-w-180px',
          },
        ],
        searchColumns: [],
        configPage: true,
        dataSource: ChannelService.getChannelList,
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    deleteChannel() {
      return ChannelService.deleteChannel
    },
  },
  methods: {
    refreshTable() {
      if (this.$refs.channelTable) {
        ;(this.$refs.channelTable as IDatatableContext).getData()
      }
    },
    openCreateModal() {
      this.channelModal = new ChannelEntity()
      this.showEdit = true
    },
    openEditModal(channel) {
      this.channelModal = plainToClass(ChannelEntity, channel)
      this.showEdit = true
    },
    closeEditModal() {
      this.showEdit = false
    },
    openDeleteModal(id) {
      this.pendingDeleteId = id
      this.showDelete = true
    },
    closeDeleteModal() {
      this.showDelete = false
    },
  },
})
</script>
