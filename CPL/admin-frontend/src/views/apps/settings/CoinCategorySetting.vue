<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.categorySetting') }}
      </div>

      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          class="d-flex justify-content-end"
          data-kt-campaign-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary me-3"
            @click="openBigCategoryEditModal()"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('setting.addBigCategory') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="openSmallCategoryEditModal()"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('setting.addSmallCategory') }}
          </button>
        </div>
        <!--end::Toolbar-->
      </div>
    </div>
    <div
      v-if="categoryTranslateState.loading"
      class="d-flex align-items-center justify-content-center loading-wrapper"
    >
      <div class="loading-area">
        <slot name="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ $t('loading') }}</span>
          </div>
        </slot>
      </div>
    </div>
    <div v-else class="card-body category-table pt-0">
      <datatable
        :config="tableConfig"
        ref="categoryTable"
        @onReceiveData="onReceiveData"
        @onOrderRowChanged="onOrderRowChanged"
      >
        <template v-slot:cell-no="{ idx: idx }">
          {{ idx + 1 }}
        </template>
        <template v-slot:cell-category="{ row: category }">
          <div class="category">
            <div class="big-category d-flex">
              <div class="title">
                <b>{{ transformTranslate(category.language_key) }}</b>
              </div>
              <div class="action d-flex align-items-center justify-content-end">
                <div class="form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="category.id"
                    :ref="category.id"
                    :checked="category.status == 1"
                    @change="onChangeStatus(category, false)"
                  />
                  <label class="form-check-label" :for="category.id"></label>
                </div>
                <a
                  @click="openBigCategoryEditModal(category)"
                  class="btn btn-sm btn-flex btn-light-primary me-3"
                >
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="/media/icons/duotune/art/art005.svg" />
                  </span>
                </a>
                <a
                  @click="deleteBigCategory(category)"
                  class="btn btn-sm btn-flex btn-light-danger me-3"
                >
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="/media/icons/duotune/art/art004.svg" />
                  </span>
                </a>
                <a
                  @click="toggleDisplayCategory(category)"
                  class="btn btn-sm btn-flex btn-light-primary me-3"
                >
                  <span class="svg-icon svg-icon-3">
                    <inline-svg
                      v-if="displayCategory[category.id]"
                      src="/media/icons/duotune/arrows/arr073.svg"
                    />
                    <inline-svg
                      v-else
                      src="/media/icons/duotune/arrows/arr072.svg"
                    />
                  </span>
                </a>
              </div>
            </div>
            <draggable
              :list="category.sub_category"
              tag="el-collapse"
              :disabled="!enabled"
              :class="{ hidden: !displayCategory[category.id] }"
              class="list-group"
              ghost-class="ghost"
              @start="dragging = true"
              @end="onEnded($event, category)"
              itemKey="draggable-sub-category"
            >
              <template #item="{ element: sub, index: idx }">
                <div class="sub-category-name list-group-item">
                  <div class="small-category d-flex">
                    <div class="title">
                      {{ transformTranslate(sub.language_key) }}
                    </div>
                    <div
                      class="action d-flex align-items-center justify-content-end"
                    >
                      <a
                        @click="openSmallCategoryEditModal(category, idx)"
                        class="btn btn-sm btn-flex btn-light-primary me-3"
                      >
                        <span class="svg-icon svg-icon-3">
                          <inline-svg
                            src="/media/icons/duotune/art/art005.svg"
                          />
                        </span>
                      </a>
                      <a
                        @click="deleteSmallCategory(category, sub)"
                        class="btn btn-sm btn-flex btn-light-danger me-3"
                      >
                        <span class="svg-icon svg-icon-3">
                          <inline-svg
                            src="/media/icons/duotune/art/art004.svg"
                          />
                        </span>
                      </a>
                      <a
                        @click="toggleDisplaySubCategory(sub.id)"
                        class="btn btn-sm btn-flex btn-light-primary me-3"
                      >
                        <span class="svg-icon svg-icon-3">
                          <inline-svg
                            v-if="displaySubCategory[sub.id]"
                            src="/media/icons/duotune/arrows/arr073.svg"
                          />
                          <inline-svg
                            v-else
                            src="/media/icons/duotune/arrows/arr072.svg"
                          />
                        </span>
                      </a>
                    </div>
                  </div>
                  <div
                    class="pair-in-sub"
                    :class="{ hidden: !displaySubCategory[sub.id] }"
                  >
                    <span
                      v-for="pair of sub.pairs"
                      :key="pair"
                      class="pair mz-3"
                    >
                      <b
                        >{{ pair.coin.toUpperCase() }}/{{
                          pair.currency.toUpperCase()
                        }}
                      </b>
                    </span>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </template>
      </datatable>
    </div>
    <EditBigCategoryModal
      v-if="showBigCategoryModal"
      :show="showBigCategoryModal"
      :isNew="isBigCatNew"
      :bigCategory="bigCategoryItem"
      :bigCategoryList="categoryList"
      @updated="refreshTable"
      @close="closeBigCatEditModal"
    />
    <EditSmallCategoryModal
      v-if="showSmallCategoryModal"
      :show="showSmallCategoryModal"
      :isNew="smallCategoryIndex === undefined"
      :bigCategory="bigCategoryItem"
      :bigCategoryList="categoryList"
      :smallCategoryIndex="smallCategoryIndex"
      @updated="refreshTable"
      @close="closeSmallCatEditModal"
    />
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import EditBigCategoryModal from '@/components/exchange-setting/EditBigCategory.vue'
import EditSmallCategoryModal from '@/components/exchange-setting/EditSmallCategory.vue'
import { defineComponent } from 'vue'
import Datatable, {
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import CONFIG from '@/config'
import { plainToClass, plainToInstance } from 'class-transformer'
import {
  BigCategory,
  CategoryList,
  DeleteSubCategory,
  SubCategorySetting,
  UpdateOrderCategoryRequestDto,
  UpdateOrderSubCategoryRequestDto,
} from '@/models/setting-exchange/CategorySetting'
import Swal from 'sweetalert2'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'
import { AxiosResponse } from 'axios'
import draggable from 'vuedraggable'
import { Actions } from '@/store/enums/StoreEnums'
import { CategoryTranslateState } from '@/store/state/translate.state'

export default defineComponent({
  name: 'coin-category-setting',
  components: {
    Datatable,
    EditBigCategoryModal,
    EditSmallCategoryModal,
    draggable,
  },
  mounted() {
    this.$store.dispatch(Actions.FETCH_CATEGORY_TRANSLATES)
    this.$store.dispatch(Actions.FETCH_CODE_LANGUAGES_ACTIVE)
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.categorySetting', ['setting.setting'])
  },
  data() {
    return {
      showBigCategoryModal: false,
      showSmallCategoryModal: false,
      bigCategoryItem: new BigCategory(),
      smallCategoryIndex: undefined as number | undefined,
      isBigCatNew: true,
      tableConfig: {
        dataSource: (params) => SettingExchangeService.getCategoryList(params),
        columns: [
          {
            key: 'no',
            title: 'setting.no',
            sortable: false,
            class: 'td-w-100px text-center',
          },
          {
            key: 'category',
            title: 'setting.category',
            sortable: false,
            class: 'td-category text-right',
          },
        ],
        configPage: true,
        rowOrder: true,
      } as ITableConfig,
      CONFIG,
      categoryList: [] as BigCategory[],
      enabled: true as boolean,
      dragging: false as boolean,
      displayCategory: {} as Record<string, boolean>,
      displaySubCategory: {} as Record<string, boolean>,
    }
  },
  computed: {
    categoryTranslateState(): CategoryTranslateState {
      return this.$store.getters.categoryTranslatesState
    },
  },
  methods: {
    async onOrderRowChanged(draggableEvent: any[]) {
      const orderCategory = draggableEvent.map((item, idx) => ({
        id: item.id,
        index: idx,
        name: item.language_key,
      }))
      const request = new UpdateOrderCategoryRequestDto()
      request.data = orderCategory

      if (!request.data.length) return

      const response = await SettingExchangeService.patchOrderCategorySetting(
        plainToInstance(UpdateOrderCategoryRequestDto, request, {
          excludeExtraneousValues: true,
        }),
      )
      if (response.status != HttpStatus.OK) {
        if (response.data && (response.data as any).message) {
          return this.$toastr.error((response.data as any).message)
        }
        return this.$toastr.error(this.$t('setting.saveCategoryError'))
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
    },
    async onEnded(_, category: BigCategory) {
      this.dragging = false
      const orderSubCategory = category.sub_category.map((item, idx) => ({
        id: item.id,
        index: idx,
        name: item.language_key,
      }))
      const request = new UpdateOrderSubCategoryRequestDto()
      request.data = orderSubCategory

      if (!request.data.length) return

      const response =
        await SettingExchangeService.patchOrderSubCategorySetting(
          plainToInstance(UpdateOrderSubCategoryRequestDto, request, {
            excludeExtraneousValues: true,
          }),
        )
      if (response.status != HttpStatus.OK) {
        if (response.data && (response.data as any).message) {
          return this.$toastr.error((response.data as any).message)
        }
        return this.$toastr.error(this.$t('setting.saveCategoryError'))
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
    },
    toggleDisplaySubCategory(subCategoryId: string) {
      if (!this.displaySubCategory[subCategoryId]) {
        this.displaySubCategory[subCategoryId] = true
      } else {
        this.displaySubCategory[subCategoryId] =
          !this.displaySubCategory[subCategoryId]
      }
    },
    toggleDisplayCategory(category: BigCategory) {
      this.bigCategoryItem = category

      if (!this.displayCategory[category.id]) {
        this.displayCategory[category.id] = true
      } else {
        this.displayCategory[category.id] = !this.displayCategory[category.id]
      }
    },
    onReceiveData(response: AxiosResponse<CategoryList>) {
      this.categoryList = response.data.data || []
    },
    transformTranslate(languageKey: string) {
      if (!this.categoryTranslateState.translates.length) return
      const index = this.categoryTranslateState.translates.findIndex(
        (item) => item.key.toUpperCase() === languageKey.toUpperCase(),
      )
      if (index === -1) {
        return languageKey
      }
      return this.categoryTranslateState.translates[index]?.en || languageKey
    },
    onChangeStatus(category) {
      Swal.fire({
        text: 'Update Status Category!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          category.status = (this.$refs[category.id] as any).checked
            ? PAIR_STATUS.ACTIVE
            : PAIR_STATUS.INACTIVE
          SettingExchangeService.patchCategorySetting(category).then((res) => {
            if (res.status != HttpStatus.OK) {
              this.recoveryPairCategoryChecked(category.id)
              this.$toastr.error(
                res?.data?.message || this.$t('setting.saveCategoryError'),
              )
              return
            }
            this.$toastr.success(this.$t('setting.saveCategorySuccess'))
          })
        } else {
          this.recoveryPairCategoryChecked(category.id)
        }
      })
    },
    recoveryPairCategoryChecked(categoryId: string) {
      ;(this.$refs[categoryId] as any).checked = !(
        this.$refs[categoryId] as any
      ).checked
    },
    openBigCategoryEditModal(bigCategory?) {
      this.showBigCategoryModal = true
      this.isBigCatNew = !bigCategory
      const bigCategoryItem = plainToClass(BigCategory, bigCategory, {
        exposeDefaultValues: true,
      })
      this.bigCategoryItem = bigCategoryItem
    },
    openSmallCategoryEditModal(bigCategory?: BigCategory, index?: number) {
      this.showSmallCategoryModal = true
      this.bigCategoryItem = bigCategory || new BigCategory()
      this.smallCategoryIndex = index
    },
    deleteBigCategory(category: BigCategory) {
      Swal.fire({
        text: 'Delete Big Category!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok, I want delete category ${this.transformTranslate(
          category.language_key,
        )}!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.confirmDeleteBigCat(category)
        }
      })
    },
    deleteSmallCategory(
      category: BigCategory,
      subCategory: SubCategorySetting,
    ) {
      Swal.fire({
        text: 'Delete Small Category!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok, I want delete ${this.transformTranslate(
          subCategory.language_key,
        )} in category ${this.transformTranslate(category.language_key)}!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.confirmDeleteSmallCat(category, subCategory)
        }
      })
    },
    async confirmDeleteBigCat(category: BigCategory) {
      const result = await SettingExchangeService.deleteCategorySetting({
        id: category.id,
      })
      if (result.status != HttpStatus.OK || !result.data.status) {
        this.$toastr.error(
          (result?.data as any)?.message ||
            this.$t('setting.deleteCategoryError'),
        )
        return
      }
      this.$toastr.success(this.$t('setting.deleteCategorySuccess'))
      this.refreshTable()
    },
    async confirmDeleteSmallCat(
      category: BigCategory,
      subCategory: SubCategorySetting,
    ) {
      if (!subCategory) return
      const result = await SettingExchangeService.deleteSubCategorySetting(
        plainToInstance(DeleteSubCategory, {
          id: subCategory.id,
        }),
      )
      if (result.status != HttpStatus.OK || !result.data.status) {
        this.$toastr.error(this.$t('setting.deleteCategoryError'))
        return
      }
      this.$toastr.success(this.$t('setting.deleteCategorySuccess'))
      this.refreshTable()
    },
    refreshTable() {
      if (this.$refs.categoryTable) {
        ;(this.$refs.categoryTable as IDatatableContext).getData()
      }
    },
    closeBigCatEditModal() {
      this.showBigCategoryModal = false
    },
    closeSmallCatEditModal() {
      this.showSmallCategoryModal = false
    },
  },
})
</script>
<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  .loading-area {
    font-size: 1.2em;
    color: white;
    background-color: #aaa;
    padding: 10px 15px;
    border-radius: 5px;
  }
}
.saveDragDrop {
  margin: 12px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.category-table::v-deep .td-category {
  width: calc(100% - 100px);
  .big-category {
    justify-content: space-between;
    height: 50px;
    align-items: center;
    border-bottom: 1px solid lightgray;
  }
  .small-category {
    margin-left: 30px;
    margin-right: 30px;
    background-color: aliceblue;
    padding: 5px;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    border-bottom: 1px solid lightgray;
  }
  .sub-category-name {
    display: flow-root;
    margin-bottom: 8px;
    border: none;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .pair-in-sub {
    min-width: 400px;
    float: left;
    text-align: left;
    overflow: hidden;
    white-space: pre-wrap;
    padding-bottom: 20px;
    padding-top: 20px;
    margin-left: 60px;
    margin-right: 150px;
    .pair {
      display: inline-block;
      width: 120px;
      padding: 5px;
      border-radius: 5px;
    }
  }
  .hidden {
    display: none !important;
  }
}
</style>
