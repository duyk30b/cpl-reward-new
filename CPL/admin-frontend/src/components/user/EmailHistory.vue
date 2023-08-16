<template>
  <base-modal
    title="emailHistory"
    :show="show"
    @close="close"
    dialogClass="modal-xl"
  >
    <template v-slot:body>
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </template>
    <template v-slot:footer>
      <button class="btn btn-secondary" type="button" @click="close">
        {{ $t('close') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { UserHistoryService } from '@/services/UserHistoryService'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { convertTimestampToDate } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'email-history',
  components: {
    BaseModal,
    Datatable,
  },
  props: {
    userId: String,
    show: Boolean,
  },
  mounted() {
    this.getData()
  },
  watch: {
    userId: function () {
      this.getData()
    },
  },
  data: () => ({
    tableReloadKey: 0,
  }),
  computed: {
    tableConfig() {
      return {
        dataSource: (params) =>
          UserHistoryService.getListEmailChangeHistories({
            ...params,
            user_id: this.userId,
          }),
        columns: [
          {
            key: 'old_email',
            title: 'oldEmail',
            class: 'td-w-350px',
          },
          {
            key: 'new_email',
            title: 'newEmail',
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
        ],
        configPage: true,
      } as ITableConfig
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getData() {
      if (!this.userId) return
      this.tableReloadKey++
    },
  },
})
</script>
