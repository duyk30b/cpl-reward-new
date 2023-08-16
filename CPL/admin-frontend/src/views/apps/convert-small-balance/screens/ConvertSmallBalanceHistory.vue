<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('convertSmallBalanceHistoryScreen.title') }}
      </div>
    </div>

    <div class="card-body">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="datatableRef"
      >
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>

        <template v-slot:cell-action="{ row: convertSmallBalance }">
          <button
            class="btn btn-sm btn-primary btn-detail hide"
            @click.prevent="
              showConvertSmallDetail(convertSmallBalance.id, $event)
            "
          >
            <span class="svg-icon svg-icon-2 me-0 arrow-down">
              <inline-svg src="media/icons/duotune/arrows/arr082.svg" />
            </span>

            <span class="svg-icon svg-icon-2 me-0 arrow-up d-none">
              <inline-svg src="media/icons/duotune/arrows/arr081.svg" />
            </span>
          </button>
        </template>
      </datatable>
    </div>
    <convert-small-balance-detail ref="convertSmallBalanceDetailRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  ITableConfig,
  DatatableSearchType,
} from '@/components/datatable/Datatable.vue'
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import { formatCurrencyAmount, jsonToCsv } from '@/core/helpers/util'
import { HttpStatus } from '@/core/variables/common.enum'
import ConvertSmallBalanceDetail from '@/views/apps/convert-small-balance/components/ConvertSmallBalanceDetail.vue'
import { ConvertSmallBalanceService } from '@/views/apps/convert-small-balance/services/ConvertSmallBalanceService'
import { UserService } from '@/services/UserService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Mutations } from '@/store/enums/StoreEnums'
import { ListConvertSmallBalanceDetail } from '@/views/apps/convert-small-balance/definition/convert-small-balance.dto'
import moment from 'moment'

export default defineComponent({
  name: 'ConvertSmallBalanceHistory',
  components: {
    Datatable,
    ConvertSmallBalanceDetail,
  },
  data() {
    return {
      querySearch: {},
      tableReloadKey: 1,
      searching: false as boolean,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'convertSmallBalanceHistoryScreen.no',
            sortable: false,
            class: 'td-w-50px align-middle text-center',
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'created_at',
            title: 'convertSmallBalanceHistoryScreen.date',
            sortable: true,
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'total_fee',
            title: 'convertSmallBalanceHistoryScreen.convertFee',
            sortable: true,
            render: (value, item) => {
              return `${formatCurrencyAmount(value, item.fee_coin, '0', 18)}`
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'total_received',
            title: 'convertSmallBalanceHistoryScreen.castleReceived',
            sortable: true,
            render: (value, item) => {
              return `${formatCurrencyAmount(value, item.fee_coin, '0', 18)}`
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'action',
            title: '',
            sortable: false,
          },
        ],
        searchColumns: [
          {
            key: 'date',
            searchType: DatatableSearchType.DATE_RANGE,
            startPlaceholder: moment()
              .startOf('date')
              .clone()
              .subtract(180, 'days')
              .format('YYYY-MM-DD'),
            endPlaceholder: moment().endOf('date').clone().format('YYYY-MM-DD'),
            inputFormat: 'YYYY-MM-DD',
            getDataOnChange: true,
            class: 'td-w-350px',
          },
          {
            key: 'user_ids',
            title: 'email',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async function (text) {
              const result = await UserService.getListUsers({
                search_field: 'email',
                search_text: text.trim(),
              })
              return result?.data?.data.map((item) => ({
                id: item.user_id,
                name: item.email,
              }))
            },
            multiple: true,
            reserveKeyword: true,
            collapseTags: true,
          },
        ],
        isRemoveSearch: true,
        configPage: true,
        configColumn: true,
        activeDownloadCsv: true,
        downloadCsv: (params) => this.handleDownloadCsv(params),
      } as ITableConfig,
      listConvertSmallBalanceDetail: {} as ListConvertSmallBalanceDetail,
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs('convertSmallBalanceHistoryScreen.title', [])
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(rootParams: any) {
      try {
        // remove detail row
        const detailElements = document.querySelectorAll(
          '.convert-small-detail',
        )
        detailElements.forEach((el) => {
          el.remove()
        })

        const params = this.transformParams(rootParams)

        this.searching = true
        const data = await ConvertSmallBalanceService.listBalanceConvertSmall(
          params,
        )

        // get list convert small detail by ids
        const convertSmallIds = data.data.map(
          (convertSmallId) => convertSmallId.id,
        )
        await this.getListConvertSmallDetailByIds(convertSmallIds)

        this.searching = false
        return {
          status: HttpStatus.OK,
          data: {
            data: data.data,
            pagination: {
              page: params.page,
              size: params.limit,
              total: data.pagination.total,
            },
          },
        }
      } catch (err) {
        this.searching = false
      }
    },

    async getListConvertSmallDetailByIds(ids) {
      let listConvertSmallBalanceDetail: any[] = []
      listConvertSmallBalanceDetail =
        await ConvertSmallBalanceService.listBalanceConvertSmallDetailByIds(ids)
      const data = {}
      if (
        listConvertSmallBalanceDetail &&
        Array.isArray(listConvertSmallBalanceDetail)
      ) {
        listConvertSmallBalanceDetail.map((convertSmallBalanceDetail) => {
          if (convertSmallBalanceDetail.convert_small_id in data) {
            data[convertSmallBalanceDetail.convert_small_id].push(
              convertSmallBalanceDetail,
            )
          } else {
            data[convertSmallBalanceDetail.convert_small_id] = [
              convertSmallBalanceDetail,
            ]
          }
        })
      }
      this.listConvertSmallBalanceDetail = data
      return data
    },

    async onSearch() {
      this.refreshTable()
    },

    transformParams(rootParams) {
      const params = { ...rootParams }
      if ('limit' in params && params.limit) {
        params.size = params.limit
      }

      if ('date' in params && params.date.length > 0) {
        const startDate = params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(180, 'days')
        const endDate = params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

        params['start_date'] = startDate.startOf('date').format('x')
        params['end_date'] = endDate.endOf('date').format('x')
        delete params.date
      }

      return params
    },

    async handleDownloadCsv(rootParams: any) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const params = this.transformParams(rootParams)
      try {
        let data = await ConvertSmallBalanceService.getAllBalanceConvertSmall(
          params,
        )
        if (!data || data.length == 0) {
          this.$toastr.warning(this.$t('noData'))
          this.$store.commit(Mutations.SHOW_API_LOADING, false)
          return
        }

        const transferHistoryData = data.map((item, index) => {
          return {
            no: index + 1,
            email: item.email,
            created_at: convertTimestampToDate(
              item.created_at,
              'YYYY-MM-DD HH:mm:ss',
            ),
            total_fee: `${formatCurrencyAmount(
              item.total_fee,
              item.fee_coin,
              '0',
              18,
            )} ${item.fee_coin.toUpperCase()}`,
            total_received: `${formatCurrencyAmount(
              item.total_received,
              item.fee_coin,
              '0',
              18,
            )} ${item.fee_coin.toUpperCase()}`,
          }
        })
        await this.downloadCsv(transferHistoryData)
      } catch (err) {
        this.$toastr.error(
          this.$t('balanceTransferHistoryScreen.exportFileError'),
        )
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'convertSmallBalanceHistoryScreen.title',
      )}-${moment().format('YYYY-MM-DD')}.csv`
      const headerTitle = [
        this.$t('convertSmallBalanceHistoryScreen.no'),
        this.$t('email'),
        this.$t('convertSmallBalanceHistoryScreen.date'),
        this.$t('convertSmallBalanceHistoryScreen.convertFee'),
        this.$t('convertSmallBalanceHistoryScreen.castleReceived'),
      ]
      const dataToCsv = jsonToCsv(data, headerTitle)
      const url = window.URL.createObjectURL(new Blob([dataToCsv]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    async showConvertSmallDetail(convertSmallId, $event) {
      const btnDetail = $event.target.closest('.btn-detail')
      const currentRow = btnDetail.parentElement.parentElement

      // check class
      if (btnDetail.classList.contains('hide')) {
        btnDetail.classList.remove('hide')
        btnDetail.classList.add('show')
        btnDetail.querySelector('.arrow-down').classList.add('d-none')
        btnDetail.querySelector('.arrow-up').classList.remove('d-none')
      } else if (btnDetail.classList.contains('show')) {
        btnDetail.classList.remove('show')
        btnDetail.classList.add('hide')
        btnDetail.querySelector('.arrow-up').classList.add('d-none')
        btnDetail.querySelector('.arrow-down').classList.remove('d-none')
      }

      const nextSibling = currentRow.nextSibling
      const elementDetail = document.getElementById(
        `convert-small-detail-${convertSmallId}`,
      )
      if (elementDetail) {
        nextSibling.remove()
        return
      }

      // generate table element
      const tbl = await this.generateTable(convertSmallId)

      // create row append
      const tdAppend = document.createElement('td')
      tdAppend.setAttribute('colspan', '6')
      tdAppend.appendChild(tbl)
      const trAppend = document.createElement('tr')
      trAppend.className = 'convert-small-detail'
      trAppend.id = `convert-small-detail-${convertSmallId}`
      trAppend.appendChild(tdAppend)

      // insert row
      currentRow.insertAdjacentElement('afterend', trAppend)
    },

    async generateTable(convertSmallId) {
      const tbl = document.createElement('table')
      tbl.className = 'table align-middle common-table table-borderless'

      // create head
      const tblHead = document.createElement('thead')
      tblHead.innerHTML = `
              <tr style="border: none !important">
                <th style="border: none !important">${this.$t(
                  'convertSmallBalanceHistoryScreen.coin',
                )}</th>
                <th style="border: none !important">${this.$t(
                  'convertSmallBalanceHistoryScreen.amount',
                )}</th>
                <th style="border: none !important">${this.$t(
                  'convertSmallBalanceHistoryScreen.fee',
                )}</th>
                <th style="border: none !important">
                  ${this.$t('convertSmallBalanceHistoryScreen.castleReceived')}
                </th>
              </tr>
      `
      tbl.appendChild(tblHead)

      let listConvertSmallBalanceDetail: any[] =
        this.listConvertSmallBalanceDetail?.[convertSmallId] ?? []

      // create tbody
      const tblBody = document.createElement('tbody')
      if (listConvertSmallBalanceDetail.length === 0) {
        tblBody.innerHTML = `
          <tr style="border: none !important">
            <td colspan="4" class="text-center py-5 text-muted" style="border: none !important">
              ${this.$t('noData')}
            </td>
          </tr>`
      } else {
        let innerHTML = ''
        for (const convertSmallBalanceDetail of listConvertSmallBalanceDetail) {
          innerHTML += `
            <tr style="border: none !important">
                  <td class="text-center" style="border: none !important">
                    ${convertSmallBalanceDetail.coin_from.toUpperCase()}
                  </td>
                  <td class="text-center" style="border: none !important">
                    ${formatCurrencyAmount(
                      convertSmallBalanceDetail.amount_from,
                      convertSmallBalanceDetail.coin_from,
                      '0',
                      18,
                    )}
                  </td>
                  <td class="text-center" style="border: none !important">
                    ${formatCurrencyAmount(
                      convertSmallBalanceDetail.fee_amount,
                      convertSmallBalanceDetail.fee_coin,
                      '0',
                      18,
                    )}
                  </td>
                  <td class="text-center" style="border: none !important">
                    ${formatCurrencyAmount(
                      convertSmallBalanceDetail.amount_to,
                      convertSmallBalanceDetail.fee_coin,
                      '0',
                      18,
                    )}
                  </td>
                </tr>
          `
        }
        tblBody.innerHTML = innerHTML
      }

      tbl.appendChild(tblBody)

      return tbl
    },
  },
})
</script>
