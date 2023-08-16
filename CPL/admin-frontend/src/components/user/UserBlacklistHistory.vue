<template>
  <base-modal
    title="userBlacklistHistory"
    :show="show"
    @close="close"
    dialogClass="modal-xl"
  >
    <template v-slot:body>
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-reasons="{ row: history }">
          <div>
            <div
              v-for="(category, index) in groupedReasons(history.reasons)"
              :key="index"
            >
              <b>{{ category[0].category.en }}</b>
              <ul>
                <li v-for="(obj, index) in category" :key="index">
                  <p>{{ obj.reason.en }}</p>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </datatable>
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
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import { UserService } from '@/services/UserService'

export default defineComponent({
  name: 'user-blacklist-history',
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
          UserService.userBlacklistHistory({
            ...params,
            user_id: this.userId,
          }),
        columns: [
          {
            key: 'type',
            title: 'type',
            class: 'text-center td-w-100px',
            render: (value) => {
              return this.$t('userBlacklistHistoryTypeValue.' + value)
            },
          },
          {
            key: 'reasons',
            title: 'reasons',
            class: 'td-w-350px text-break',
          },
          {
            key: 'created_at',
            title: 'createdAt',
            sortable: true,
            class: 'td-w-100px',
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
    groupedReasons(reasons) {
      if (!reasons) {
        return []
      }
      const groupedData = reasons.reduce((acc, obj) => {
        const categoryKey = JSON.stringify(obj.category) // Convert category object to string for comparison
        acc[categoryKey] = acc[categoryKey] || [] // Create a new array for the category if it doesn't exist
        acc[categoryKey].push(obj) // Add the current object to the array for the category
        return acc
      }, {})

      const result = Object.values(groupedData) // Convert the object of arrays to an array of arrays
      return result
    },
  },
})
</script>
