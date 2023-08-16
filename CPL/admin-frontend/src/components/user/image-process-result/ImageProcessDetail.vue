<template>
  <cynopsis-detail
    v-if="result?.provider == KycImageProvider.CYNOPSIS"
    :result="result"
    :userKyc="userKyc"
    :initTab="initTab"
    :show="show"
    @close="close"
  ></cynopsis-detail>

  <amazon-rekognition-detail
    v-if="result?.provider == KycImageProvider.AMAZON"
    :result="result"
    :userKyc="userKyc"
    :initTab="initTab"
    :show="show"
    @close="close"
  ></amazon-rekognition-detail>

  <sumsub-detail
    v-if="result?.provider == KycImageProvider.SUMSUB"
    :result="result"
    :userKyc="userKyc"
    :initTab="initTab"
    :show="show"
    @close="close"
  ></sumsub-detail>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  ImageProcessResult,
  KycImageProvider,
} from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import CynopsisDetail from './CynopsisDetail.vue'
import AmazonRekognitionDetail from './amazon-rekognition-detail/AmazonRekognitionDetail.vue'
import SumsubDetail from './sumsub-detail/SumsubDetail.vue'

export default defineComponent({
  emits: ['close'],
  name: 'image-process-detail',
  components: { CynopsisDetail, AmazonRekognitionDetail, SumsubDetail },
  props: {
    result: ImageProcessResult,
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    show: Boolean,
    initTab: String,
  },
  data() {
    return {
      KycImageProvider,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>
