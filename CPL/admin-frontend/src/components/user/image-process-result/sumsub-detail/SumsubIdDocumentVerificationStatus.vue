<template>
  <no-data
    v-if="!userKyc || !detail?.identityDocumentVerificationResponse"
  ></no-data>
  <template v-else>
    <div
      class="row mb-2 border-bottom"
      v-for="image in detail?.identityDocumentVerificationResponse.images"
      :key="image.imageId"
    >
      <div class="col-lg-4 col-md-6">
        <div class="image-wrapper">
          <div
            class="image-tag"
            :class="
              detail.identityDocumentVerificationResponse.result
                ?.imageReviewResults?.[image.imageId]?.reviewAnswer
            "
          >
            {{ image.idDocDef.idDocType }}
          </div>
          <img-with-large-view
            :src="fileMap?.[image.imageId]"
            img-class="w-100"
          />
        </div>
      </div>
      <div class="col-lg-8 col-md-6">
        <div class="image-info">
          <div>
            {{ $t('addedDate') }}: <b>{{ image.addedDate }} (GMT)</b>
          </div>
          <div>
            {{ $t('resolution') }}:
            <b>
              {{ image.actualResolution.width }} x
              {{ image.actualResolution.height }}
            </b>
          </div>
          <div>
            {{ $t('size') }}: <b>{{ image.fileSize / 1000 }} KB</b>
          </div>
          <div>
            {{ $t('imageType') }}: <b>{{ image.mimeType }}</b>
          </div>
          <div>
            {{ $t('camera') }}:
            <b>{{
              image.make ? `${image.make} ${image.model}` : $t('missing')
            }}</b>
          </div>
          <div>
            {{ $t('addedFrom') }}: <b>{{ image.creatorClientId }}</b>
          </div>
          <div class="d-flex flex-wrap mt-2">
            <div
              class="sumsub-rejection-reasons"
              v-for="reason in detail.identityDocumentVerificationResponse
                .result?.imageReviewResults?.[image.imageId]?.rejectLabels"
              :key="reason"
            >
              {{ reason }}
            </div>
          </div>
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

export default defineComponent({
  name: 'sumsub-id-document-verification-status',
  components: { NoData },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    detail: null as unknown as PropType<SumsubDetail>,
    fileMap: {} as PropType<Record<string, string>>,
  },
  data() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.image-wrapper {
  position: relative;

  .image-tag {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 1;
    padding: 3px 9px;
    border-radius: 2px;
    color: white;

    &.GREEN {
      background-color: rgb(25, 188, 155);
    }
    &.YELLOW {
      background-color: rgb(238, 167, 13);
    }
    &.RED {
      background-color: rgb(239, 86, 86);
    }
  }
}
</style>
