<template>
  <div class="section-block" v-if="userKyc">
    <div class="section-header">
      {{ $t('identificationDocument') }}
    </div>
    <div class="row mb-4">
      <div
        class="col-xl-3 col-lg-4 col-md-6 text-center pb-2"
        v-for="(img, index) in userKyc?.imageFiles"
        :key="index"
        :class="{ 'tag-changed': tagChanged('files') }"
      >
        <img-with-large-view
          :src-list="userKyc.imageUrls"
          :src="img.path"
          img-class="img-auto-height mb-3"
        />
        <div class="fw-bold">
          {{ $t('kycDocumentMetadataValue.' + img.metadata) }}
        </div>
      </div>
    </div>
    <div class="row info-section">
      <div class="border-bottom mb-5">
        <image-process-result-component
          :userKyc="userKyc"
        ></image-process-result-component>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('documentType') }}</label>
        <div class="value">
          {{ $t('kycDocumentTypeValue.' + userKyc?.idDocumentType) }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('documentID') }}</label>
        <div
          class="value"
          :class="{ 'tag-changed': tagChanged('idDocumentNo') }"
        >
          {{ userKyc?.idDocumentNo }}
        </div>
      </div>
    </div>
  </div>
  <div class="row section-block">
    <div class="col-lg-6 info-section mb-4">
      <div class="section-header">{{ $t('customerInformation') }}</div>
      <div class="info-field">
        <label class="label">{{ $t('nationality') }}</label>
        <div
          class="value"
          :class="{ 'tag-changed': tagChanged('nationalityId') }"
        >
          {{ $filters.getCountryName(userInfo?.nationalityId) }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">
          {{ $t('firstName') }}/{{ $t('givenName') }}
        </label>
        <div class="value" :class="{ 'tag-changed': tagChanged('firstName') }">
          {{ userInfo?.firstName }}
        </div>
      </div>
      <div class="info-field">
        <label class="label"> {{ $t('lastName') }}/{{ $t('surname') }} </label>
        <div class="value" :class="{ 'tag-changed': tagChanged('lastName') }">
          {{ userInfo?.lastName }}
        </div>
      </div>
      <div class="info-field" v-if="userInfo?.nationalityId == JAPAN_ID">
        <label class="label">
          {{ $t('furigana') }}
        </label>
        <div class="value" :class="{ 'tag-changed': tagChanged('furigana') }">
          {{ userInfo?.furigana1 }} {{ userInfo?.furigana2 }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('birthdate') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('birthday') }">
          {{ userInfo?.birthday }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('gender') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('gender') }">
          {{ $t('genderValue.' + userInfo?.gender) }}
        </div>
      </div>
      <div class="mt-5 mb-4">
        <label class="fs-4 fw-bold text-uppercase mb-3">
          {{ $t('remarks') }}
        </label>
        <textarea
          :value="userKyc?.remark"
          class="form-control"
          disabled
        ></textarea>
      </div>
    </div>
    <div class="col-lg-6 info-section">
      <div class="section-header">
        {{ $t('currentAddress') }} ({{ $t('registeredAddress') }})
      </div>
      <div class="info-field">
        <label class="label">{{ $t('building') }}/{{ $t('room') }}</label>
        <div
          class="value"
          :class="{ 'tag-changed': tagChanged('buildingRoom') }"
        >
          {{ userInfo?.buildingRoom }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('address') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('address') }">
          {{ userInfo?.address }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('city') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('city') }">
          {{ userInfo?.city }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('state') }}/{{ $t('region') }}</label>
        <div
          class="value"
          :class="{ 'tag-changed': tagChanged('stateRegion') }"
        >
          {{ userInfo?.stateRegion }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('zipCode') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('zipCode') }">
          {{ userInfo?.zipCode }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('country') }}</label>
        <div class="value" :class="{ 'tag-changed': tagChanged('countryId') }">
          {{ $filters.getCountryName(userInfo?.countryId) }}
        </div>
      </div>
      <div class="info-field">
        <label class="label">{{ $t('phoneNumber') }}</label>
        <div
          class="value"
          :class="{ 'tag-changed': tagChanged('phoneNumber') }"
        >
          {{ userInfo?.phoneNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import { KycStatus, UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import ImageProcessResultComponent from '@/components/user/image-process-result/ImageProcessResultComponent.vue'
import CONFIG from '@/config'

export default defineComponent({
  name: 'personal-information-screen',
  components: { ImageProcessResultComponent },
  props: {
    userInfo: {
      type: Object as PropType<UserInfo | UserInfoHistory>,
    },
    userKyc: {
      type: Object as PropType<UserKyc | UserKycHistory>,
    },
  },
  data: () => ({
    showRejectionReasonModal: false,
    KycStatus,
    JAPAN_ID: CONFIG.JAPAN_ID,
  }),
  methods: {
    tagChanged(tag: string) {
      return this.userInfo && this.userInfo.tagChanged(tag)
    },
  },
})
</script>
