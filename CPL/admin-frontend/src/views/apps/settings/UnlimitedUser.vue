<template>
  <div class="card">
    <div class="card-body pt-4">
      <div class="d-flex justify-content-end">
        <a class="btn btn-primary me-1 text-uppercase" @click="openEdit({})">
          {{ $t('unlimitedUser.add') }}
        </a>
      </div>
      <div class="stick-horizontal"></div>

      <!-- Search -->
      <div class="d-flex mt-4">
        <div class="col-2">
          <label class="form-label"
            >{{ $t('exchangeHistory.searchType') }}:</label
          >
          <v-select
            :options="keywordList"
            option-value="id"
            option-label="name"
            v-model="keywordType"
            searchable
            :can-deselect="false"
            :isTranslate="false"
          ></v-select>
        </div>
        <div class="col-8">
          <label class="form-label">{{ $t('exchangeHistory.keyword') }}:</label>
          <div class="d-flex input-keyword">
            <input
              class="form-control"
              v-model="keyword"
              :placeholder="$t('keyword')"
              @keyup="(e) => e.keyCode == 13 && getData()"
            />
            <button
              class="btn btn-primary btn-search"
              :disabled="loading"
              @click="getData"
              :title="$t('search')"
            >
              <i v-if="!loading" class="fas fa-search fa-fw"></i>
              <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
              <span class="">{{ $t('search') }}</span>
            </button>
            <button
              class="btn btn-primary reset-btn"
              :disabled="loading"
              @click="resetSearch"
              :title="$t('reset')"
            >
              <i v-if="!loading" class="fas fa-sync fa-fw"></i>
              <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
              <span>{{ $t('reset') }}</span>
            </button>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
      <div class="dataTables_wrapper dt-bootstrap4 no-footer">
        <div class="table-responsive">
          <table
            :class="[loading && 'overlay overlay-block']"
            class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
            id="kt_customers_table"
            role="grid"
          >
            <thead>
              <tr
                class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0"
                role="row"
                v-if="tableHeader && tableHeader.length"
              >
                <template v-for="(cell, i) in tableHeader" :key="i">
                  <th
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
                    :class="[
                      cell.sortable && 'sorting cursor-pointer',
                      isSorting(cell) &&
                        sortType === SortType.DESC &&
                        'sorting_desc',
                      isSorting(cell) &&
                        sortType === SortType.ASC &&
                        'sorting_asc',
                    ]"
                    @click="sortColumn(cell)"
                  >
                    {{ cell.name }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="fw-bold text-gray-600">
              <template v-if="items && items.length">
                <template v-for="(item, i) in items" :key="i">
                  <tr class="odd">
                    <template v-for="(cell, i) in tableHeader" :key="i">
                      <td
                        v-if="cell.key !== 'action'"
                        :class="{
                          'text-end': tableHeader.length - 1 === i,
                          [cell.className]: cell.className,
                          'max-width-250': 1,
                        }"
                      >
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key !== 'create_time'"
                        >
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{ item[cell.key] }}
                          </span>
                        </slot>
                        <slot :name="`cell-${cell.key}`" :row="item" v-else>
                          {{
                            formatUTCDate(
                              +item[cell.key],
                              'YYYY-MM-DD HH:mm:ss',
                            )
                          }}
                        </slot>
                      </td>
                      <td v-else>
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <div class="d-flex align-items-center">
                            <button
                              class="btn btn-sm btn-primary mr-2"
                              @click="openEdit(item)"
                            >
                              Edit
                            </button>

                            <button
                              class="btn btn-sm btn-danger"
                              @click="onDelete(item)"
                            >
                              Delete
                            </button>
                          </div>
                        </slot>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
              <tr class="odd" v-else>
                <td :colspan="6" class="text-center">
                  {{ $t('noData') }}
                </td>
              </tr>
            </tbody>
            <div
              v-if="loading"
              class="overlay-layer card-rounded bg-dark bg-opacity-5"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <!--end::Table body-->
          </table>
        </div>

        <div class="row">
          <div
            class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
          >
            <div class="dataTables_length" id="kt_customers_table_length">
              <label
                ><select
                  v-model="pagination.rowsPerPage"
                  name="kt_customers_table_length"
                  class="form-select form-select-sm form-select-solid"
                  @change="getData"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select></label
              >
              <span v-if="items && items.length">
                {{
                  $t('tableDisplayResult', {
                    start: (pagination.page - 1) * pagination.rowsPerPage + 1,
                    end:
                      (pagination.page - 1) * pagination.rowsPerPage +
                      items.length,
                    total: pagination.total,
                  })
                }}
              </span>
            </div>
          </div>
          <div
            class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
          >
            <el-pagination
              v-model:current-page="pagination.page"
              @current-change="currentPageChange"
              :page-size="pagination.rowsPerPage"
              layout="prev, pager, next"
              :total="pagination.total"
              :hide-on-single-page="false"
              background
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <UnlimitedUserModal
      :item="itemEdit"
      @updateData="updateData"
      @close="isOpenModal = false"
      v-if="isOpenModal"
    />
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud, formatUTCDate } from '@/core/helpers/common.helper'
import { defineComponent, onMounted, ref } from 'vue'
import { IPagination } from '@/core/data/deposit'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import UnlimitedUserModal from './modal/UnlimitedUserModal.vue'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n/index'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import { UserParam } from '@/models/exchange-history/BlacklistUser'
import { USER_DROPDOWN_SEARCH_KEY } from '@/models/exchange-history/OpenOrder'

export default defineComponent({
  components: {
    UnlimitedUserModal,
  },
  setup() {
    const tableHeader = ref([
      {
        name: 'User Id',
        key: 'user_id',
        sortable: true,
      },
      {
        name: 'Email',
        key: 'email',
        sortable: true,
      },
      {
        name: 'Note',
        key: 'note',
        sortable: false,
      },
      {
        name: 'Reason',
        key: 'reason',
        sortable: false,
      },
      {
        name: 'Registered date',
        key: 'create_time',
        sortable: false,
      },
      {
        name: '',
        key: 'action',
        sortable: false,
      },
    ])
    const keywordList = ref([
      {
        id: USER_DROPDOWN_SEARCH_KEY.ALL,
        name: 'All',
      },
      {
        id: USER_DROPDOWN_SEARCH_KEY.USER_ID,
        name: 'User ID',
      },
      {
        id: USER_DROPDOWN_SEARCH_KEY.EMAIL,
        name: 'Email',
      },
    ])
    const getData = () => {
      let p: UserParam = {
        page: pagination.value.page,
        per_page: pagination.value.rowsPerPage,
        keyword: keyword.value.trim(),
        sort_type: sortType.value == SortType.DESC ? -1 : 1,
        sort_by: sort.value,
      }
      if (p.keyword) {
        p.search_by_field = keywordType.value
      }
      loading.value = true
      ExchangeHistoryService.getUnlimitedUser(p)
        .then((res) => {
          if (res.data) {
            pagination.value.total = res.data.pagination.total
            items.value = res.data.data || []
          }
          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }

    const tableReloadKey = ref(0)
    const items = ref()
    const searchText = ref('')

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('menu.unlimitedUser', ['menu.unlimitedUser'])
      getData()
    })

    const page = ref(1)
    const total = ref(0)
    const rowsPerPage = ref(10)
    const pagination = ref<IPagination>({
      page: page.value,
      total: total.value,
      rowsPerPage: rowsPerPage.value,
    })
    const currentPageChange = () => {
      getData()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.rowsPerPage = +pagination.value.rowsPerPage
      getData()
    }
    const router = useRouter()

    const openEdit = (item) => {
      itemEdit.value = {
        user_id: item.user_id || '',
        note: item.note || '',
        reason: item.reason || '',
        email: item.email || '',
      }
      isOpenModal.value = true
      router.replace({ query: { isEdit: item.user_id ? 'true' : 'false' } })
    }

    const onDelete = (item) => {
      ElMessageBox.confirm('Are you sure to delete?').then(() => {
        loading.value = true
        ExchangeHistoryService.deleteUnlimitedUser(item.user_id).then((res) => {
          if (res && res.status === 200) {
            ElNotification({
              title: '',
              message: t('success'),
              type: 'success',
            })
            getData()
          } else {
            ElNotification({
              title: '',
              message: t('error'),
              type: 'error',
            })
            loading.value = false
          }
        })
      })
    }

    const itemEdit = ref({
      user_id: '',
      note: '',
      reason: '',
      email: '',
    })
    const { t } = useI18n()

    const loading = ref(false)
    const isOpenModal = ref(false)
    const updateData = () => {
      getData()
      isOpenModal.value = false
    }
    const keyword = ref('')
    const keywordType = ref(USER_DROPDOWN_SEARCH_KEY.ALL)

    const resetSearch = () => {
      keywordType.value = USER_DROPDOWN_SEARCH_KEY.ALL
      keyword.value = ''
      getData()
    }

    const getSortKey = (col: IColumnConfig) => {
      return col.sortKey || col.key
    }

    const sort = ref('')

    const sortType = ref('')

    const isSorting = (col: IColumnConfig) => {
      return sort.value == getSortKey(col)
    }

    const sortColumn = (col: IColumnConfig) => {
      if (!col.sortable) return
      if (isSorting(col)) {
        if (sortType.value == SortType.DESC) {
          sort.value = ''
          sortType.value = ''
        } else if (sortType.value == SortType.ASC) {
          sortType.value = SortType.DESC
        } else {
          sortType.value = SortType.ASC
        }
      } else {
        sort.value = getSortKey(col)
        sortType.value = SortType.ASC
      }
      getData()
    }

    return {
      tableHeader,
      items,
      searchText,
      tableReloadKey,
      pagination,
      rowsPerPage,
      getData,
      currentPageChange,
      setItemsPerPage,
      openEdit,
      itemEdit,
      onDelete,
      loading,
      isOpenModal,
      updateData,
      keyword,
      sortColumn,
      isSorting,
      SortType,
      sortType,
      formatUTCDate,
      keywordList,
      keywordType,
      resetSearch,
    }
  },
})
</script>
<style lang="scss" scoped>
.mw-150px {
  min-width: 150px;
}
.mr-2 {
  margin-right: 0.5rem;
}
.max-width-250 {
  max-width: 250px;
  word-break: break-word;
}
.btn-search {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.input-keyword {
  align-items: flex-start;
  margin-left: 10px;
  input {
    flex: 1;
    max-width: 300px;
  }
}
.reset-btn {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
