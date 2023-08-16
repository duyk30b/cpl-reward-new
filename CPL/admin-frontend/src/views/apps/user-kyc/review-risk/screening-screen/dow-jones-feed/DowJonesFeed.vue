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
  <div class="row mb-2">
    <div class="col-lg-6 d-flex">
      <span class="text-uppercase me-8 fw-bold">{{
        $t('addSearchConditions')
      }}</span>
      <label
        v-for="(value, filter) in match"
        :key="filter"
        class="d-flex align-items-center me-5"
      >
        <input
          type="checkbox"
          :id="`filter-${filter}`"
          class="me-2"
          v-model="match[filter]"
          @change="refreshTable()"
        />
        {{ $t(filter) }}
      </label>
    </div>
  </div>
  <datatable :config="tableConfig" ref="table">
    <template v-slot:cell-country="{ row: item }">
      <template v-if="item?.searchResponse?.countryDetail?.length">
        <div
          v-for="(data, index) of item.searchResponse.countryDetail"
          :key="index"
        >
          {{ data.type }}: {{ data.country }}
        </div>
      </template>
      <template v-else>-</template>
    </template>
    <template v-slot:cell-dateDetail="{ row: item }">
      <template v-if="item?.searchResponse?.dateDetail?.length">
        <div v-for="data of item.searchResponse.dateDetail" :key="data.date">
          {{ data.type }}: {{ data.date }}
        </div>
      </template>
      <template v-else>-</template>
    </template>
    <template v-slot:cell-category="{ row: item }">
      <template v-if="item?.searchResponse?.descriptions?.length">
        <div
          v-for="data of item.searchResponse.descriptions"
          :key="data.description1"
        >
          {{ data.description1 }}
        </div>
      </template>
      <template v-else>-</template>
    </template>
    <template v-slot:cell-detail="{ row: item }">
      <a href="javascript:void(0)" @click="showDetail(item)">
        <i class="fas fa-search"></i>
      </a>
    </template>
  </datatable>
  <dow-jones-feed-modal
    :detail="currentDetail"
    :show="showDetailModal"
    @close="showDetailModal = false"
  ></dow-jones-feed-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IDJData, IDJDataResult } from '@/models/user/UserKycScanData'
import {
  buildLocalDatatableResponse,
  formatDate,
} from '@/core/helpers/common.helper'
import Datatable, {
  IDataSourceParams,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { Gender, UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import DowJonesFeedModal from './DowJonesFeedModal.vue'

export default defineComponent({
  name: 'dow-jones-feed',
  components: { Datatable, DowJonesFeedModal },
  props: {
    userInfo: {
      type: Object as PropType<UserInfo | UserInfoHistory>,
    },
    results: {
      type: Object as PropType<IDJData[]>,
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
      currentDetail: {} as IDJDataResult,
      showDetailModal: false,
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
            render: (value, row) => {
              return row?.searchResponse?.primaryName || '-'
            },
          },
          {
            key: 'country',
            title: 'country',
          },
          {
            key: 'dateDetail',
            title: 'dateDetail',
          },
          {
            key: 'category',
            title: 'category',
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
      const { name, birthdate, country, gender } = this.match
      let data = [...this.displayingResult.searchResults]
      if (name) {
        data = data.filter((item) =>
          item.searchResponse.primaryName.includes(this.userInfo?.firstName),
        )
      }
      if (birthdate) {
        const strDate = formatDate(this.userInfo?.birthday, 'L')
        data = data.filter((item) => {
          const resultDate = formatDate(item?.searchResponse?.dateOfBirth, 'L')
          return !resultDate || strDate == resultDate
        })
      }
      if (country) {
        // TODO: Wait for country api
        // data = data.filter((item) => {
        //   if (
        //     item.searchResponse.nationality.includes(
        //       this.getCountryName(this.userInformation.country_id),
        //     )
        //   ) {
        //     return item
        //   }
        //   if (item.searchResponse.nationality.includes('Not Known')) {
        //     return item
        //   }
        // })
      }
      if (gender) {
        data = data.filter((item) => {
          const gender = (item?.searchResponse?.gender || '').toUpperCase()
          return Gender[this.userInfo?.gender || ''] == gender
        })
      }
      return data
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
    showDetail(item: IDJDataResult) {
      this.currentDetail = item
      this.showDetailModal = true
    },
  },
})
</script>
