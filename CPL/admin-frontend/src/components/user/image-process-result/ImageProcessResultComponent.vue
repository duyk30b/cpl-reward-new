<template>
  <template
    v-for="(imageProcessResult, index) in imageProcessResults"
    :key="index"
  >
    <div class="section-header d-flex align-ittems-center mb-3 fs-5 text-grey">
      {{ $t(`imageProvider.${imageProcessResult.provider}`) }}

      <div
        v-if="imageProcessResult.resultText"
        class="ms-5 cursor-pointer"
        :class="{
          'text-success':
            imageProcessResult.resultStatus == KycProviderResultStatus.PASS,
          'text-danger':
            imageProcessResult.resultStatus == KycProviderResultStatus.FAIL,
        }"
        @click="showImageProcessDetail(imageProcessResult)"
      >
        {{ imageProcessResult.resultText }}
      </div>
    </div>

    <div class="info-field" v-if="imageProcessResult.compareStatus != null">
      <label class="label">
        {{ $t('compareFace') }}
      </label>
      <div class="value">
        <span
          class="cursor-pointer"
          @click="
            showImageProcessDetail(
              imageProcessResult,
              ImageProcessDetailTab.COMPARE_STATUS,
            )
          "
        >
          <i
            class="fas me-1"
            :class="{
              'fa-check-circle text-success':
                imageProcessResult?.compareFacePass,
              'fa-times-circle text-danger':
                !imageProcessResult?.compareFacePass,
            }"
          ></i>
          <span class="text-uppercase">
            {{ $t(`ocrStatus.${imageProcessResult?.compareStatus}`) }}
          </span>
          <span class="fw-normal">
            (<a href="javascript:void(0)">{{ $t('detail') }}</a
            >)
          </span>
        </span>
      </div>
    </div>

    <div class="info-field" v-if="imageProcessResult.duplicateStatus != null">
      <label class="label">
        {{ $t('hasDuplicateFaces') }}
      </label>
      <div class="value">
        <span
          class="cursor-pointer"
          @click="
            showImageProcessDetail(
              imageProcessResult,
              ImageProcessDetailTab.DUPLICATE_STATUS,
            )
          "
        >
          <i
            class="fas me-1"
            :class="{
              'fa-check-circle text-success':
                imageProcessResult?.checkDuplicatePass,
              'fa-exclamation-circle text-warning':
                imageProcessResult?.checkDuplicateWarning,
              'fa-times-circle text-danger':
                !imageProcessResult?.checkDuplicatePass &&
                !imageProcessResult?.checkDuplicateWarning,
            }"
          ></i>
          <span class="text-uppercase">
            {{ $t(`duplicateStatus.${imageProcessResult?.duplicateStatus}`) }}
          </span>
          <span class="fw-normal">
            (<a href="javascript:void(0)">{{ $t('detail') }}</a
            >)
          </span>
        </span>
      </div>
    </div>

    <div class="info-field" v-if="imageProcessResult.livenessStatus != null">
      <label class="label">
        {{ $t('livenessCheck') }}
      </label>
      <div class="value">
        <span
          class="cursor-pointer"
          @click="
            showImageProcessDetail(
              imageProcessResult,
              ImageProcessDetailTab.LIVENESS_STATUS,
            )
          "
        >
          <i
            class="fas me-1"
            :class="{
              'fa-check-circle text-success': imageProcessResult?.livenessPass,
              'fa-times-circle text-danger': !imageProcessResult?.livenessPass,
            }"
          ></i>
          <span class="text-uppercase">
            {{ $t(`livenessStatus.${imageProcessResult?.livenessStatus}`) }}
          </span>
          <span class="fw-normal">
            (<a href="javascript:void(0)">{{ $t('detail') }}</a
            >)
          </span>
        </span>
      </div>
    </div>

    <div
      class="info-field"
      v-if="imageProcessResult.identityDocumentVerificationStatus != null"
    >
      <label class="label">
        {{ $t('identityDocumentVerification') }}
      </label>
      <div class="value">
        <span
          class="cursor-pointer"
          @click="
            showImageProcessDetail(
              imageProcessResult,
              ImageProcessDetailTab.IDENTTITY_DOCUMENT_VERIFICATION_STATUS,
            )
          "
        >
          <i
            class="fas me-1"
            :class="{
              'fa-check-circle text-success':
                imageProcessResult?.identityDocumentVerificationPass,
              'fa-times-circle text-danger':
                !imageProcessResult?.identityDocumentVerificationPass,
            }"
          ></i>
          <span class="text-uppercase">
            {{
              $t(
                `identityDocumentVerificationStatus.${imageProcessResult?.identityDocumentVerificationStatus}`,
              )
            }}
          </span>
          <span class="fw-normal">
            (<a href="javascript:void(0)">{{ $t('detail') }}</a
            >)
          </span>
        </span>
      </div>
    </div>

    <image-process-detail
      :result="imageProcessResult"
      :userKyc="userKyc"
      :show="showImageProcessModal[imageProcessResult.provider]"
      :initTab="imageProcessTab[imageProcessResult.provider]"
      @close="showImageProcessModal[imageProcessResult.provider] = false"
    ></image-process-detail>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  ImageProcessResult,
  KycProviderResultStatus,
} from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import ImageProcessDetail from './ImageProcessDetail.vue'
import { ImageProcessDetailTab } from './image-process-detail.const'
import { UserKycService } from '@/services/UserKycService'

export default defineComponent({
  name: 'image-process-result',
  components: { ImageProcessDetail },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
  },
  watch: {
    'userKyc.userKycHistoryId': {
      handler: async function () {
        await this.getImageProcessResults()
      },
      immediate: true,
    },
  },
  data() {
    return {
      imageProcessResults: [] as ImageProcessResult[],
      showImageProcessModal: {},
      imageProcessTab: {},
      ImageProcessDetailTab,
      KycProviderResultStatus,
    }
  },
  methods: {
    async getImageProcessResults() {
      if (!this.userKyc) return
      this.imageProcessResults =
        await UserKycService.getImageProcessResultsByKycHistoryId(
          this.userKyc.userKycHistoryId,
        )
    },
    showImageProcessDetail(result: ImageProcessResult, tab = null) {
      this.showImageProcessModal[result.provider] = true
      this.imageProcessTab[result.provider] = tab
    },
  },
})
</script>
