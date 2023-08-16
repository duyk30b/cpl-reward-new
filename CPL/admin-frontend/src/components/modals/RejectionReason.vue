<template>
  <base-modal
    title="rejectionReasons"
    :show="show"
    @close="close"
    dialogClass="modal-xl"
  >
    <template v-slot:body>
      <div class="row">
        <div class="col-lg-6">
          <div class="section-title">{{ $t('chooseCase') }}</div>
          <div
            class="section-content d-flex justify-content-center align-items-center text-secondary"
            v-if="loadingData"
          >
            <i class="fas fa-spinner fa-spin fa-3x"></i>
          </div>
          <div class="section-content" v-if="!loadingData">
            <div class="accordion" id="rejection-reason-accordion">
              <div
                class="accordion-item ps-4"
                v-for="(category, categoryIndex) in reasonCategories"
                :key="categoryIndex"
              >
                <div class="accordion-header d-flex">
                  <label
                    :for="`category-select-${categoryIndex}`"
                    class="flex-grow-1 d-flex align-items-center fw-bold cursor-pointer"
                    :title="showNameByLocale(category.name)"
                  >
                    <input
                      type="checkbox"
                      :id="`category-select-${categoryIndex}`"
                      class="me-3"
                      v-model="category.checked"
                    />
                    {{ showNameByLocale(category.name) }}
                  </label>
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#reason-category-${categoryIndex}`"
                    aria-expanded="true"
                    :aria-controls="`#reason-category-${categoryIndex}`"
                  ></button>
                </div>
                <div
                  :id="`reason-category-${categoryIndex}`"
                  class="accordion-collapse collapse"
                >
                  <div class="accordion-body py-0">
                    <label
                      v-for="(reason, reasonIndex) in category.reasons"
                      :key="reasonIndex"
                      :for="`reason-select-${reasonIndex}`"
                      class="flex-grow-1 d-flex cursor-pointer mb-4"
                      :title="showNameByLocale(reason.name)"
                    >
                      <input
                        type="checkbox"
                        :id="`reason-select-${reasonIndex}`"
                        class="me-3 mt-1"
                        v-model="reason.checked"
                      />
                      {{ showNameByLocale(reason.name) }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="section-title">{{ $t('caseSelected') }}</div>
          <div class="section-content py-3">
            <div
              class="d-flex px-4 py-2"
              v-for="(reason, i) in selectedReasons"
              :key="i"
            >
              <div class="me-3">
                <button
                  class="btn btn-sm btn-light px-4 py-2"
                  @click="reason.checked = false"
                >
                  <i class="fa fa-trash-alt p-0"></i>
                </button>
              </div>
              {{ showNameByLocale(reason.name) }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-danger me-2"
        type="button"
        @click="submit"
        :disabled="!selectedReasons.length || loading"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        {{ $t('submit') }}
      </button>
      <button class="btn btn-secondary" type="button" @click="close">
        {{ $t('cancel') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from './BaseModal.vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import { ReasonService } from '@/services/ReasonService'
import { IReasonCategory } from '@/interfaces/reason-category.interface'
import { IReason } from '@/interfaces/reason.interface'
import i18n from '@/core/plugins/i18n'

export default defineComponent({
  name: 'rejection-reasons-modal',
  components: {
    BaseModal,
  },
  created() {
    this.getData()
  },
  watch: {
    reasonType: function () {
      this.reset()
      this.getData()
    },
    show: async function () {
      if (!this.show || this.initFinished) return
      await this.getData()
      this.initFinished = true
    },
  },
  computed: {
    allReasons() {
      return this.reasonCategories.reduce(
        (acc, category) => [...acc, ...(category.reasons || [])],
        [] as IReason[],
      )
    },
    selectedReasons() {
      return this.allReasons.filter((reason) => reason.checked)
    },
    selectedReasonsToSubmit() {
      return this.reasonCategories.reduce((acc, category) => {
        if (category.reasons) {
          const reasonsToSubmit = category.reasons
            .filter((reason) => reason.checked)
            .map((reason) => ({
              reasonId: reason.id,
              categoryId: category.id,
              category: category.name,
              reason: reason.name,
            }))
          return [...acc, ...reasonsToSubmit]
        }
        return [...acc]
      }, [] as any[])
    },
  },
  props: {
    id: String,
    title: String,
    show: Boolean,
    loading: Boolean,
    reasonType: {
      type: Number,
      default: ReasonCategoryTypeEnum.KYC_PERSONAL,
    },
  },
  data: () => ({
    reasonCategories: [] as IReasonCategory[],
    loadingData: false,
    initFinished: false,
  }),
  methods: {
    close() {
      this.$emit('close')
      this.reset()
    },
    submit() {
      this.$emit('submit', this.selectedReasonsToSubmit)
    },
    async getData() {
      this.loadingData = true
      this.reasonCategories = await ReasonService.getReasonCategoryListByType(
        this.reasonType,
      )
      this.loadingData = false
    },
    reset() {
      this.allReasons.forEach((reason) => (reason.checked = false))
    },
    showNameByLocale(name) {
      const locale = i18n.global.locale.value
      return name[locale] || ''
    },
  },
})
</script>

<style lang="scss" scoped>
.section-title {
  color: #1ea1f2;
  margin-bottom: 10px;
  font-size: 1.3em;
}
.section-content {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  height: 350px;
  overflow-y: auto;

  .accordion-item {
    border-radius: 0 !important;

    &:nth-child(2n + 1) {
      background-color: #f5f5f5;
    }

    .accordion-button {
      width: unset;
    }

    .accordion-button {
      background-color: unset;
      box-shadow: unset;
    }
  }
}
</style>
