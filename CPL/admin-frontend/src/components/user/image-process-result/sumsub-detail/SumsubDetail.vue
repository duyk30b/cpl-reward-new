<template>
  <base-modal title="Sumsub" :show="show" @close="close" dialogClass="modal-xl">
    <template v-slot:body>
      <template v-if="!loading">
        <div class="sumsub-summary" :class="reviewResult">
          <div class="mb-1">
            <i
              class="fas me-1 fs-3"
              :class="{
                'fa-check-circle text-success':
                  reviewResult == SumsubReviewAnswer.GREEN,
                'fa-times-circle text-danger':
                  reviewResult != SumsubReviewAnswer.GREEN,
              }"
            ></i>
            <b
              class="ms-1 fs-3"
              :class="{
                'text-success': reviewResult == SumsubReviewAnswer.GREEN,
                'text-danger': reviewResult != SumsubReviewAnswer.GREEN,
              }"
            >
              {{ reviewResult }}
            </b>
          </div>
          <div>
            {{ $t('applicantID') }}:
            {{ detail?.applicantResponse?.id || $t('unknown') }}
          </div>
          <template v-if="reviewResult == SumsubReviewAnswer.RED">
            <div>
              {{ $t('rejectType') }}:
              <b
                class="ms-1"
                :class="{
                  'text-success': reviewResult == SumsubReviewAnswer.GREEN,
                  'text-danger': reviewResult != SumsubReviewAnswer.GREEN,
                }"
              >
                {{ reviewRejectType }}
              </b>
            </div>
            <div class="mb-1">{{ $t('rejectionReasons') }}:</div>
            <div class="d-flex flex-wrap">
              <div
                class="sumsub-rejection-reasons"
                v-for="reason in rejectLabels"
                :key="reason"
              >
                {{ reason }}
              </div>
            </div>
          </template>
        </div>
        <ul
          class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
          role="tablist"
        >
          <li class="nav-item" v-for="tab in availableTabs" :key="tab">
            <a
              class="nav-link text-uppercase"
              :class="{ active: tab == currentTab }"
              data-bs-toggle="tab"
              href="javascript:void(0)"
              @click="chooseTab(tab)"
              role="tab"
            >
              {{ $t(`imageProcessDetailTab.${tab}`) }}
            </a>
          </li>
        </ul>
        <div
          class="tab-content py-8 border-start border-end border-bottom px-6"
        >
          <div
            class="tab-pane"
            :class="{
              active:
                !currentTab ||
                currentTab == ImageProcessDetailTab.COMPARE_STATUS,
            }"
          >
            <sumsub-compare-status
              :userKyc="userKyc"
              :detail="detail"
              :fileMap="fileMap"
            ></sumsub-compare-status>
          </div>
          <div
            class="tab-pane"
            :class="{
              active: currentTab == ImageProcessDetailTab.LIVENESS_STATUS,
            }"
          >
            <sumsub-liveness-status
              :userKyc="userKyc"
              :detail="detail"
              :fileMap="fileMap"
            ></sumsub-liveness-status>
          </div>
          <div
            class="tab-pane"
            :class="{
              active:
                currentTab ==
                ImageProcessDetailTab.IDENTTITY_DOCUMENT_VERIFICATION_STATUS,
            }"
          >
            <sumsub-id-document-verification-status
              :userKyc="userKyc"
              :detail="detail"
              :fileMap="fileMap"
            ></sumsub-id-document-verification-status>
          </div>
          <div
            class="tab-pane"
            :class="{
              active: currentTab == ImageProcessDetailTab.DUPLICATE_STATUS,
            }"
          >
            <sumsub-duplicate-status
              :userKyc="userKyc"
              :detail="detail"
              :fileMap="fileMap"
            ></sumsub-duplicate-status>
          </div>
        </div>
      </template>
      <div class="text-center py-4" v-else>
        <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-secondary" type="button" @click="close">
        {{ $t('close') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ImageProcessResult, SumsubDetail } from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import BaseModal from '@/components/modals/BaseModal.vue'
import { ImageProcessDetailTab } from '../image-process-detail.const'
import SumsubCompareStatus from './SumsubCompareStatus.vue'
import SumsubLivenessStatus from './SumsubLivenessStatus.vue'
import SumsubIdDocumentVerificationStatus from './SumsubIdDocumentVerificationStatus.vue'
import SumsubDuplicateStatus from './SumsubDuplicateStatus.vue'
import { Optional } from '@/models/common/Optional'
import { UserKycService } from '@/services/UserKycService'
import { SumsubReviewAnswer } from '@/models/common/Sumsub'

export default defineComponent({
  emits: ['close'],
  name: 'sumsub-detail',
  components: {
    BaseModal,
    SumsubCompareStatus,
    SumsubLivenessStatus,
    SumsubIdDocumentVerificationStatus,
    SumsubDuplicateStatus,
  },
  mounted() {
    this.chooseTab(this.initTab)
  },
  props: {
    result: ImageProcessResult,
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    show: Boolean,
    initTab: {
      type: String,
      default: ImageProcessDetailTab.COMPARE_STATUS,
    },
  },
  watch: {
    show: function () {
      this.chooseTab(this.initTab)
    },
    initTab: function () {
      this.chooseTab(this.initTab)
    },
    userKycHistoryId: {
      handler() {
        this.getData()
      },
      immediate: true,
    },
  },
  data() {
    return {
      ImageProcessDetailTab,
      currentTab: ImageProcessDetailTab.COMPARE_STATUS as unknown as string,
      detail: null as Optional<SumsubDetail>,
      fileMap: {} as Record<string, string>,
      loading: false,
      availableTabs: [
        ImageProcessDetailTab.COMPARE_STATUS,
        ImageProcessDetailTab.DUPLICATE_STATUS,
        ImageProcessDetailTab.LIVENESS_STATUS,
        ImageProcessDetailTab.IDENTTITY_DOCUMENT_VERIFICATION_STATUS,
      ],
      SumsubReviewAnswer,
    }
  },
  computed: {
    userKycHistoryId() {
      return this.userKyc?.userKycHistoryId
    },
    reviewResult() {
      return (
        this.detail?.applicantStatusResponse?.reviewResult?.reviewAnswer ||
        this.$t('unknown')
      )
    },
    reviewRejectType() {
      return this.detail?.applicantStatusResponse?.reviewResult
        ?.reviewRejectType
    },
    rejectLabels() {
      return (
        this.detail?.applicantStatusResponse?.reviewResult?.rejectLabels || []
      )
    },
  },
  methods: {
    chooseTab(tab: string) {
      this.currentTab = tab || ImageProcessDetailTab.COMPARE_STATUS
    },
    close() {
      this.$emit('close')
    },
    async getSumsubDetail() {
      if (this.userKycHistoryId) {
        this.detail = await UserKycService.getSumsubDetailByKycHistoryId(
          this.userKycHistoryId,
        )
      }
    },
    async getSumsubFileMap() {
      if (this.userKycHistoryId) {
        this.fileMap = await UserKycService.getSumsubFileMapByKycHistoryId(
          this.userKycHistoryId,
        )
      }
    },
    async getData() {
      this.loading = true
      await Promise.all([this.getSumsubDetail(), this.getSumsubFileMap()])
      this.loading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.sumsub-summary {
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;

  &.GREEN {
    background-color: #dcffdc;
  }
  &.RED {
    background-color: #fdf2f2;
  }
}
::v-deep .sumsub-rejection-reasons {
  border-radius: 4px;
  padding: 5px 10px;
  background-color: #f1416c;
  color: white;
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
