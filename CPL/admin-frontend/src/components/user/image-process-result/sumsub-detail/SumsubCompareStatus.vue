<template>
  <no-data v-if="!userKyc || !detail?.compareResponse"></no-data>
  <template v-else>
    <div class="row text-center mb-3">
      <div class="col-lg-6 mb-2">
        <img-with-large-view
          :src="fileMap?.[detail.compareResponse.faceMatchInfo?.faceContentId1]"
          img-class="img-auto-height"
        />
        <div class="fw-bold">
          {{ $t('kycDocumentMetadataValue.' + userKyc.faceFile.metadata) }}
        </div>
      </div>
      <div class="col-lg-6 mb-2">
        <img-with-large-view
          :src="fileMap?.[detail.compareResponse.faceMatchInfo?.faceContentId2]"
          img-class="img-auto-height"
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
          detail.compareResponse.answer == SumsubReviewAnswer.GREEN
            ? 'text-success'
            : 'text-danger'
        "
      >
        {{ $t('similarity') }}:
        {{
          detail.compareResponse.faceMatchInfo?.confidence
            ? `${$filters.fixedNumber(
                detail.compareResponse.faceMatchInfo?.confidence * 100,
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
import { SumsubDetail } from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import NoData from '@/components/common/NoData.vue'
import { SumsubReviewAnswer } from '@/models/common/Sumsub'

export default defineComponent({
  name: 'sumsub-compare-status',
  components: { NoData },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    detail: null as unknown as PropType<SumsubDetail>,
    fileMap: {} as PropType<Record<string, string>>,
  },
  data() {
    return {
      SumsubReviewAnswer,
    }
  },
})
</script>
