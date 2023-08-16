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
    <template v-slot:cell-name="{ row: item }">
      {{ parseContent(item?.searchResponse?.parse, 'NAME') }}
    </template>
    <template v-slot:cell-alias="{ row: item }">
      {{ parseContent(item?.searchResponse?.parse, 'ALIAS') }}
    </template>
    <template v-slot:cell-list="{ row: item }">
      <template v-if="item?.uniqueReferenceCode">
        {{ item.uniqueReferenceCode }}
      </template>
      <template v-else>-</template>
    </template>
    <template v-slot:cell-additionalInformation="{ row: item }">
      <template v-if="item?.searchResponse">
        <div
          v-for="key in [
            'GRT',
            'SDNName',
            'SDNType',
            'callSign',
            'concatAl',
            'DOB',
            'entNum',
            'formattedName',
            'gender',
            'nationality',
            'on_SDN',
            'program',
            'recordType',
            'remarks',
            'title',
            'tonnage',
            'vessFlag',
            'vessOwner',
            'vessType',
          ]"
          :key="key"
        >
          {{ $t(`artemiscanKey.${key}`) }}:
          {{ item.searchResponse[key] || '-' }}
        </div>
      </template>
    </template>
  </datatable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IArtemiScanData } from '@/models/user/UserKycScanData'
import {
  buildLocalDatatableResponse,
  formatDate,
} from '@/core/helpers/common.helper'
import Datatable, {
  IDataSourceParams,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'

export default defineComponent({
  name: 'artemiscan',
  components: { Datatable },
  props: {
    results: {
      type: Object as PropType<IArtemiScanData[]>,
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
      match: {
        name: false,
        birthdate: false,
        country: false,
        gender: false,
      },
    }
  },
  computed: {
    tableConfig() {
      return {
        dataSource: (params) => this.getResultItems(params),
        columns: [
          {
            key: 'name',
            title: 'name',
          },
          {
            key: 'alias',
            title: 'alias',
          },
          {
            key: 'list',
            title: 'list',
          },
          {
            key: 'additionalInformation',
            title: 'additionalInformation',
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
      return this.displayingResult.searchResults
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
    parseContent(content, type) {
      if (!content) return ''
      const strToArr = content.split('|')
      const data = strToArr.find((item) => item.includes(type))
      return data ? data.split(':')[1] : ''
    },
  },
})
</script>
