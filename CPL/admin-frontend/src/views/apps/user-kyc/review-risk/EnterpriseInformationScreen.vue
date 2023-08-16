<template>
  <div class="section-block" v-if="enterpriseInfo">
    <div class="section-header">{{ $t('basicInformation') }}</div>
    <div class="row mb-4">
      <div class="col-lg-6 info-section">
        <div class="info-field">
          <label class="label">{{ $t('companyName') }}</label>
          <div class="value">{{ enterpriseInfo?.companyName }}</div>
        </div>
        <div class="info-field">
          <label class="label">
            {{ $t('companyRegisteredCountry') }}
          </label>
          <div class="value">{{ enterpriseInfo?.companyRegisterCountry }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('companyLocation') }}</label>
          <div class="value">{{ enterpriseInfo?.companyLocation }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('contactNumber') }}</label>
          <div class="value">{{ enterpriseInfo?.contactNumber }}</div>
        </div>
      </div>
      <div class="col-lg-6 info-section">
        <div class="info-field">
          <label class="label">{{ $t('entityType') }}</label>
          <div class="value">{{ enterpriseInfo?.entityType }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('registeredDate') }}</label>
          <div class="value">{{ enterpriseInfo?.registeredDate }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('ownershipStructureLayer') }}</label>
          <div class="value">{{ enterpriseInfo?.ownershipStructureLayer }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('incorporationNumber') }}</label>
          <div class="value">{{ enterpriseInfo?.incorporationNumber }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-block" v-if="enterpriseInfo">
    <div class="section-header">{{ $t('registrationUserInformation') }}</div>
    <div class="row mb-4">
      <div class="col-lg-6 info-section">
        <div class="info-field">
          <label class="label">{{ $t('applicantName') }}</label>
          <div class="value">{{ enterpriseInfo?.applicantName }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('loginEmail') }}</label>
          <div class="value">{{ enterpriseInfo?.loginEmail }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('applicantJobTitle') }}</label>
          <div class="value">{{ enterpriseInfo?.applicantJobTitle }}</div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('reasonToApply') }}</label>
          <div class="value">{{ enterpriseInfo?.reasonApply }}</div>
        </div>
      </div>
    </div>
  </div>

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
          :src-list="userKyc?.imageUrls"
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

  <div class="section-block">
    <div class="section-header">{{ $t('enterpriseInformation') }}</div>
    <div class="row mb-4">
      <div class="col-lg-6 info-section">
        <div class="info-field">
          <label class="label">{{ $t('sourcesOfFunding') }}</label>
          <div class="value">
            {{ enterpriseInfo?.sourcesFunding }}
            {{ enterpriseInfo?.fundingCurrency }}
          </div>
        </div>
        <div
          class="info-field"
          v-for="metadata in [
            KycIdDocumentMetadata.CERTIFICATE_BUSINESS,
            KycIdDocumentMetadata.OFFICIAL_COMPANY_REPORT,
            KycIdDocumentMetadata.MEMORANDUM_ARTICLES,
            KycIdDocumentMetadata.LETTER_AUTHORIZATION,
            KycIdDocumentMetadata.SUPPLEMENTARY_INFORMATION,
          ]"
          :key="metadata"
        >
          <label class="label">
            {{ $t(`kycDocumentMetadataValue.${metadata}`) }}
          </label>
          <div class="value">
            <button
              class="btn btn-sm btn-primary"
              @click="downloadKycFile(metadata)"
            >
              {{ $t('downloadFile') }}
            </button>
          </div>
        </div>
        <div class="info-field">
          <label class="label">{{ $t('websiteUrl') }}</label>
          <div class="value">
            <a :href="enterpriseInfo?.urlWebsite || '#'">
              {{ enterpriseInfo?.urlWebsite }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-block">
    <div class="section-header">{{ $t('relatedParties') }}</div>
    <div class="table-responsive">
      <table
        class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3"
      >
        <thead>
          <tr class="fw-bolder text-muted">
            <th>{{ $t('name') }}</th>
            <th>{{ $t('role') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(party, partyIndex) in enterpriseInfo?.userRelatedParties"
            :key="partyIndex"
          >
            <td class="align-top">{{ party.nameToDisplay }}</td>
            <td>
              <a
                class="role-collapse collapsed d-block mb-3"
                data-bs-toggle="collapse"
                :href="`#party-roles-${partyIndex}`"
                role="button"
                aria-expanded="false"
                :aria-controls="`party-roles-${partyIndex}`"
                >{{
                  $t('holdRole', party.addRoles.length, {
                    count: party.addRoles.length,
                  })
                }}
                <i class="fas ms-1"></i>
              </a>
              <div class="collapse ps-4" :id="`party-roles-${partyIndex}`">
                <ul>
                  <li
                    v-for="(role, roleIndex) in party.addRoles.length"
                    :key="roleIndex"
                  >
                    {{ role }}
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <image-process-detail
    :result="imageProcessResult"
    :userKyc="userKyc"
    :show="showImageProcessModal"
    :initTab="imageProcessTab"
    @close="showImageProcessModal = false"
  ></image-process-detail>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import {
  KycStatus,
  UserKyc,
  KycIdDocumentMetadata,
  UserKycHistory,
} from '@/models/user/UserKyc'
import { EnterpriseInfo } from '@/models/user/EnterpriseInfo'
import { downloadFile } from '@/core/helpers/common.helper'
import ImageProcessResultComponent from '@/components/user/image-process-result/ImageProcessResultComponent.vue'
import CONFIG from '@/config'

export default defineComponent({
  name: 'enterprise-information-screen',
  components: { ImageProcessResultComponent },
  props: {
    userInfo: {
      type: Object as PropType<UserInfo | UserInfoHistory>,
    },
    userKyc: {
      type: Object as PropType<UserKyc | UserKycHistory>,
    },
    enterpriseInfo: {
      type: EnterpriseInfo,
    },
  },
  data: () => ({
    showRejectionReasonModal: false,
    KycStatus,
    KycIdDocumentMetadata,
    JAPAN_ID: CONFIG.JAPAN_ID,
  }),
  methods: {
    downloadKycFile(metadata: KycIdDocumentMetadata) {
      if (!this.userKyc) {
        return this.$toastr.error(this.$t('fileNotFound'))
      }
      const file = this.userKyc.getFileByMetadata(metadata)
      if (!file) {
        return this.$toastr.error(this.$t('fileNotFound'))
      }
      downloadFile(file.path, file.name)
    },
    tagChanged(tag: string) {
      return this.userInfo && this.userInfo.tagChanged(tag)
    },
  },
})
</script>

<style lang="scss" scoped>
.role-collapse {
  border-bottom: 1px solid #eee;
  i {
    &::before {
      content: '\f106';
    }
  }
  &.collapsed {
    border-bottom: 0;
    i {
      &::before {
        content: '\f107';
      }
    }
  }
}
</style>
