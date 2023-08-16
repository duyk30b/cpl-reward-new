<template>
  <no-data
    v-if="
      !userKyc ||
      !rekognitionInfoHistory ||
      !rekognitionInfoHistoryDetail?.compareResponse
    "
  ></no-data>
  <template v-else>
    <div class="row text-center mb-3">
      <div class="col-lg-6 mb-2">
        <img-with-bounding-box
          :src="userKyc.faceFile.path"
          :boundingBoxs="[
            rekognitionInfoHistoryDetail?.compareFaceSourceBoundingBox,
          ]"
        />
        <div class="fw-bold">
          {{ $t('kycDocumentMetadataValue.' + userKyc.faceFile.metadata) }}
        </div>
      </div>
      <div class="col-lg-6 mb-2">
        <img-with-bounding-box
          :src="userKyc.frontDocumentFile.path"
          :boundingBoxs="
            rekognitionInfoHistoryDetail?.compareFaceTargetBoundingBoxs
          "
        />
        <div class="fw-bold">
          {{
            $t('kycDocumentMetadataValue.' + userKyc.frontDocumentFile.metadata)
          }}
        </div>
      </div>
    </div>
    <div class="text-center fs-1">
      <span
        :class="
          rekognitionInfoHistoryDetail?.compareFaceSimilarity
            ? 'text-success'
            : 'text-danger'
        "
      >
        {{ $t('similarity') }}:
        {{
          rekognitionInfoHistoryDetail?.compareFaceSimilarity
            ? `${$filters.fixedNumber(
                rekognitionInfoHistoryDetail?.compareFaceSimilarity,
                2,
              )}%`
            : '-'
        }}
      </span>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  RekognitionInfoHistory,
  RekognitionInfoHistoryDetail,
} from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import NoData from '@/components/common/NoData.vue'
import ImgWithBoundingBox from '../ImgWithBoundingBox.vue'

export default defineComponent({
  name: 'amazon-rekognition-compare-status',
  components: { NoData, ImgWithBoundingBox },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    rekognitionInfoHistory: null as unknown as PropType<RekognitionInfoHistory>,
    rekognitionInfoHistoryDetail:
      null as unknown as PropType<RekognitionInfoHistoryDetail>,
  },
})
</script>
