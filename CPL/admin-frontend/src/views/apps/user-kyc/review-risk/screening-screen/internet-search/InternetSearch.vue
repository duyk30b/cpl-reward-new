<template>
  <div class="row mb-4">
    <div class="col-lg-3 col-md-4">
      <v-select
        :options="versions"
        option-value="id"
        option-label="name"
        :placeholder="versions.length ? $t('versions') : $t('noData')"
        :disabled="!versions.length"
        v-model="currentVersionId"
        :can-deselect="false"
        @change="refreshTable()"
      >
      </v-select>
    </div>
  </div>
  <datatable :config="tableConfig" ref="table">
    <template v-slot:cell-linkDetail="{ row: item }">
      <a :href="item.link" target="_blank">{{ item.title }}</a>
      <div>{{ item.summary }}</div>
    </template>
    <template v-slot:cell-mostRelevantName="{ row: item }">
      {{ item.ner ? item.ner.replace(/[|[]|]|'/g, '').split(',')[0] : '' }}
    </template>
    <template v-slot:cell-sentimentScore="{ row: item }">
      {{ item.sentiment }}
    </template>
    <template v-slot:cell-detail="{ row: item }">
      <a href="javascript:void(0)" @click="showDetail(item)">
        <i class="fas fa-search"></i>
      </a>
    </template>
  </datatable>
  <internet-search-modal
    :detail="currentDetail"
    :show="showDetailModal"
    @close="showDetailModal = false"
  ></internet-search-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  IInternetSearchData,
  IInternetSearchDataResult,
} from '@/models/user/UserKycScanData'
import {
  buildLocalDatatableResponse,
  formatDate,
} from '@/core/helpers/common.helper'
import Datatable, {
  IDataSourceParams,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import InternetSearchModal from './InternetSearchModal.vue'

export default defineComponent({
  name: 'internet-search',
  components: { Datatable, InternetSearchModal },
  props: {
    results: {
      type: Object as PropType<IInternetSearchData[]>,
    },
  },
  watch: {
    results: function () {
      this.refreshTable()
    },
  },
  data() {
    return {
      versionId: null as any,
      showDetailModal: false,
      currentDetail: {} as IInternetSearchDataResult,
    }
  },
  computed: {
    tableConfig() {
      return {
        dataSource: (params) => this.getResultItems(params),
        columns: [
          {
            key: 'linkDetail',
            title: 'linkDetail',
          },
          {
            key: 'mostRelevantName',
            title: 'mostRelevantName',
          },
          {
            key: 'sentimentScore',
            title: 'sentimentScore',
          },
          {
            key: 'detail',
            title: 'detail',
            class: 'text-center',
          },
        ],
        configPage: true,
      } as ITableConfig
    },
    versions() {
      if (!this.results) return []
      return this.results.map((result) => ({
        id: result.id,
        name: formatDate(result.createdAt, 'YYYY/MM/DD, h:mm:ss a'),
      }))
    },
    currentVersionId: {
      get() {
        return this.versionId || this.versions[0]?.id
      },
      set(val) {
        this.versionId = val
      },
    },
    displayingResult() {
      if (!this.results) return null
      if (!this.currentVersionId) return this.results[0]
      return this.results.find((result) => result.id == this.currentVersionId)
    },
    displayingItems() {
      if (!this.displayingResult) return []
      return this.displayingResult.internetSearchResults
    },
  },
  methods: {
    refreshTable() {
      if (this.$refs.table) {
        ;(this.$refs.table as IDatatableContext).getData()
      }
    },
    getResultItems(params: IDataSourceParams) {
      return buildLocalDatatableResponse(
        this.displayingItems,
        params.page,
        params.per_page,
      )
    },
    showDetail(item: IInternetSearchDataResult) {
      this.currentDetail = item
      this.showDetailModal = true
    },
  },
})
</script>
