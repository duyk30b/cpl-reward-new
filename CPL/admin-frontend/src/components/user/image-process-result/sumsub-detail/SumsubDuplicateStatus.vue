<template>
  <no-data
    v-if="
      !userKyc || !detail?.similarApplicantsResponse?.similarApplicants?.length
    "
  ></no-data>
  <template v-else>
    <div
      class="row mb-2 border-bottom"
      v-for="(item, index) in detail?.similarApplicantsResponse
        .similarApplicants"
      :key="index"
    >
      <div class="col-lg-4 col-md-6">
        <img-with-large-view
          v-if="item.originalImageId"
          :src="fileMap?.[item.originalImageId]"
          img-class="w-100"
        />
        <div v-else class="text-center">
          {{ $t('imageNotDuplicate') }}
        </div>
      </div>
      <div class="col-lg-8 col-md-6">
        <div>
          <div>
            {{ $t('applicantID') }}: <b>{{ item.applicant?.id }}</b>
          </div>
          <div>
            {{ $t('duplicateType') }}: <b>{{ item.types.join(', ') }}</b>
          </div>
          <div>
            {{ $t('similarity') }}:
            <b>
              {{
                item.faceMatchConfidence
                  ? $filters.fixedNumber(item.faceMatchConfidence * 100, 2)
                  : '--'
              }}%
            </b>
          </div>
          <router-link
            :to="{
              name: 'user.detail',
              params: {
                id: getUserIdFromSumsubExternalId(
                  item.applicant.externalUserId,
                ),
              },
            }"
          >
            {{ $t('detail') }}
          </router-link>
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
import { getUserIdFromSumsubExternalId } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'sumsub-duplicate-status',
  components: { NoData },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    detail: null as unknown as PropType<SumsubDetail>,
    fileMap: {} as PropType<Record<string, string>>,
  },
  methods: {
    getUserIdFromSumsubExternalId,
  },
})
</script>

<style lang="scss" scoped>
.duplicate-applicant {
  padding: 10px;
  border-radius: 10px;
}
</style>
