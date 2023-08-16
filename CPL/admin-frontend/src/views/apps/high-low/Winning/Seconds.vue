<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-10">
        <!-- Mode -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.mode') }}:</label>
          <v-select
            :options="modeOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.mode')"
            v-model="mode"
            searchable
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Pair -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.pair') }}:</label>
          <v-select
            :options="pairOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="pair"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Period -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.period') }}:</label>
          <v-select
            :options="periodOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.period')"
            v-model="period"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
      </div>

      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <div class="card-body p-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { UserService } from '@/services/UserService'
import store from '@/store'

import CONFIG from '@/config'
import { HighLowService } from '@/services/HighLowService'

export default defineComponent({
  name: 'seconds',
  components: {
    Datatable,
  },
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,

      // mode
      mode: '',
      modeOptions: [...store.getters.getModes],

      // period
      period: '',
      periodOptions: [...store.getters.getPeriod],

      pair: '',
      pairOptions: [...store.getters.getPairs],

      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (_, table) => {
          this.$data['loading'] = table.loading
        },
        dataSource: (params) =>
          HighLowService.getWinningRateSeconds({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'remainingSeconds',
            title: 'highLow.remainingSeconds',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'winTimes',
            title: 'highLow.winTimes',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'loseTimes',
            title: 'highLow.loseTimes',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'winRate',
            title: 'highLow.winRate',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'loseRate',
            title: 'highLow.loseRate',
            class: 'text-center td-w-100px min-w-80px',
            sortable: true,
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: false,
        tableName: 'winning-seconds-table',
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        mode: this.mode || undefined,
        period: this.period || undefined,
        pair: this.pair || undefined,
      }
    },
  },
  methods: {
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.mode = ''
      this.period = ''
      this.pair = ''

      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
