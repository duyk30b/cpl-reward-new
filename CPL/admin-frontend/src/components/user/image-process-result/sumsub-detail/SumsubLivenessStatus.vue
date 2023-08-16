<template>
  <no-data v-if="!userKyc || !detail?.livenessResponse"></no-data>
  <template v-else>
    <div class="row text-center mb-3">
      <div
        class="col-lg-4 mb-2"
        v-for="image in detail?.livenessResponse.livenessInfo.livenessData
          .images"
        :key="image.imageId"
      >
        <img-with-large-view
          :src="fileMap?.[image.imageId]"
          img-class="img-auto-height"
        />
        <div
          :class="{
            'text-success':
              detail.livenessResponse.answer == SumsubReviewAnswer.GREEN,
            'text-danger':
              detail.livenessResponse.answer != SumsubReviewAnswer.GREEN,
          }"
        >
          {{
            $filters.convertDateFormat(
              image.ts,
              'YYYY-MM-DD HH:mm:ss',
              'HH:mm:ss',
            )
          }}
          (GMT)
        </div>
      </div>
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
  name: 'sumsub-liveness-status',
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
