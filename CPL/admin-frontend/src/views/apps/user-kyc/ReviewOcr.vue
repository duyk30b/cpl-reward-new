<template>
  <div class="card mb-5">
    <div class="card-header pt-2">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <div class="card-title page-header text-header d-block">
          [{{ $t('userInformationVerification') }}]
          {{ user?.email }}
          <span class="text-danger" v-if="user?.status == UserStatus.INACTIVE">
            ({{ $t('deleted') }})
          </span>
          <span
            class="text-danger"
            v-if="user?.status == UserStatus.PENDING_DELETE"
          >
            ({{ $t('pendingDelete') }})
          </span>
          <div class="fs-7 fw-normal text-dark">
            [{{ $t('registeredDate') }}:
            {{ $filters.convertTimestampToDate(user?.createdAt) }}]
          </div>
          <div class="version-note" v-if="!isCurrentInfoVersion">
            [{{
              $t('updatedByAt', {
                name: userInfo.isModifiedByUser ? 'User' : 'Admin',
                time: $filters.convertTimestampToDate(userInfo.createdAt),
              })
            }}]
          </div>
        </div>
        <div>
          <ban-btn
            :userId="userId"
            :isBanned="user?.isBanned"
            @banStatusChange="($event) => (user.isBanned = $event)"
          ></ban-btn>
        </div>
      </div>
    </div>

    <div class="card-body pt-4">
      <Form as="" v-slot="{ meta: formMeta }" ref="formEl">
        <div class="section-block" v-if="userInfo">
          <div class="section-header d-flex align-items-center">
            1. {{ $t('identificationDocument') }}
            <router-link
              class="btn btn-sm btn-primary ms-auto me-2 text-normal"
              :to="{ name: 'user.detail', params: { id: user?.id } }"
            >
              {{ $t('menu.basicInfo') }}
            </router-link>
            <button
              class="btn btn-sm btn-primary"
              @click="showInfoHistory = true"
            >
              <span class="d-none d-md-block">{{ $t('versionHistory') }}</span>
              <i class="fas fa-history d-inline-flex d-md-none"></i>
            </button>
          </div>
          <div class="row info-section">
            <div class="col-xxl-5 col-xl-6 mb-4">
              <div class="border-bottom mb-5">
                <image-process-result-component
                  :userKyc="userKyc"
                ></image-process-result-component>
              </div>
              <div class="info-field">
                <label class="label">
                  {{ $t('firstName') }}
                </label>
                <div
                  class="value"
                  :class="{ 'tag-changed': tagChanged('firstName') }"
                >
                  {{ userInfo.firstName }}
                </div>
              </div>
              <div class="info-field">
                <label class="label">
                  {{ $t('lastName') }}
                </label>
                <div
                  class="value"
                  :class="{ 'tag-changed': tagChanged('lastName') }"
                >
                  {{ userInfo.lastName }}
                </div>
              </div>
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
                <label class="label">{{ $t('birthdate') }}</label>
                <div
                  class="value"
                  :class="{ 'tag-changed': tagChanged('birthday') }"
                >
                  {{ userInfo.birthday }}
                </div>
              </div>
              <div class="info-field">
                <label class="label">{{ $t('documentType') }}</label>
                <div class="value">
                  {{
                    userKyc?.idDocumentType
                      ? $t('kycDocumentTypeValue.' + userKyc?.idDocumentType)
                      : '-'
                  }}
                </div>
              </div>
              <div class="info-field">
                <label class="label">{{ $t('documentID') }}</label>
                <div
                  class="value"
                  :class="{
                    'tag-changed': tagChanged('idDocumentNo'),
                  }"
                >
                  {{ userKyc?.idDocumentNo || '-' }}
                </div>
              </div>
            </div>
            <div class="col-xxl-7 col-xl-6 mb-4">
              <div class="row" :class="{ 'tag-changed': tagChanged('files') }">
                <div
                  class="col-xxl-6 col-lg-6 col-xl-12 text-center pb-2"
                  v-for="(img, index) in userKyc?.imageFiles"
                  :key="index"
                >
                  <img-with-large-view
                    :src="img.path"
                    :src-list="userKyc?.imageUrls"
                    img-class="img-auto-height mb-3"
                  />
                  <div class="fw-bold">
                    {{ $t('kycDocumentMetadataValue.' + img.metadata) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-block" v-if="isCurrentKycVersion">
          <div class="section-header">2. {{ $t('checklist') }}</div>
          <ul class="checklist-section mb-8">
            <li
              class="mb-4"
              v-for="(compare, i) in [
                'compareName',
                'compareBirthday',
                'compareDocumentType',
                'compareLivenessSelfie',
              ]"
              :key="i"
            >
              <div class="row">
                <div class="col-xl-6 col-lg-8 required">
                  {{ $t(`reviewOcr.${compare}`) }}
                </div>
                <div class="col-xl-6 col-lg-4 d-flex">
                  <label class="checklist-label">
                    <input
                      type="radio"
                      class="checklist-radio"
                      value="1"
                      :name="compare"
                      v-model="form[compare]"
                      :disabled="readOnly"
                    />
                    {{ $t('yes') }}
                  </label>
                  <label class="checklist-label">
                    <input
                      type="radio"
                      class="checklist-radio"
                      value="0"
                      :name="compare"
                      v-model="form[compare]"
                      :disabled="readOnly"
                    />
                    {{ $t('no') }}
                  </label>
                </div>
              </div>
            </li>
          </ul>
          <div class="mb-8" v-if="isCurrentKycVersion && !readOnly">
            <Field
              v-model="form.idDocumentNo"
              type="text"
              name="idDocumentNo"
              v-slot="{ field, errorMessage, meta }"
              :rules="`idDocumentUnique:${currentUserKyc.userId},${currentUserKyc.idDocumentType},${currentUserKyc.countryId}`"
              :validateOnChange="false"
              :validateOnInput="false"
            >
              <div class="d-flex">
                <div class="me-3 pt-4 text-nowrap">
                  <label class="text-grey ps-4 required">
                    {{ $t('documentID') }}
                  </label>
                </div>
                <div class="me-3">
                  <input
                    class="form-control w-100"
                    v-bind="field"
                    :class="{ error: meta.dirty && !meta.valid }"
                    :disabled="readOnly"
                  />
                  <error-display :message="errorMessage"></error-display>
                </div>
                <div class="pt-3">
                  <i
                    v-if="form.idDocumentNo && !meta.pending && meta.valid"
                    class="fas fa-check fa-2x text-success"
                  ></i>
                  <i
                    v-if="!meta.pending && !meta.valid"
                    class="fas fa-times fa-2x text-danger"
                  ></i>
                  <i
                    v-if="meta.pending"
                    class="fas fa-spinner fa-spin fa-2x text-info"
                  ></i>
                </div>
              </div>
            </Field>
          </div>
          <div class="text-danger ps-4">
            {{ $t('requiredFieldForAccepKycNote') }}
          </div>
        </div>

        <div
          class="section-block"
          v-if="isCurrentKycVersion && currentUserKyc?.needShowRejectionReasons"
        >
          <div class="section-header">3. {{ $t('rejectionReasons') }}</div>
          <ul>
            <li
              v-for="(reason, i) in currentUserKyc?.rejectionReasons"
              :key="i"
            >
              {{ reason.nameByLocale }}
            </li>
          </ul>
        </div>
        <div class="mb-4 ps-4" v-if="isCurrentKycVersion">
          <template v-if="!readOnly">
            <button
              class="btn btn-success me-2"
              :disabled="!form.canAccept || !formMeta.valid || loading.submit"
              @click="accept"
            >
              {{ $t('accept') }}
            </button>
            <button
              class="btn btn-danger me-2"
              :disabled="
                (form.idDocumentNo && !formMeta.valid) || loading.submit
              "
              @click="showRejectionReasonModal = true"
            >
              {{ $t('reject') }}
            </button>
            <button
              class="btn btn-warning me-2"
              @click="pending"
              :disabled="
                (form.idDocumentNo && !formMeta.valid) || loading.submit
              "
            >
              {{ $t('pending') }}
            </button>
          </template>
          <template v-if="readOnly">
            <div class="fs-2 fw-bolder">
              <span
                v-if="currentUserKyc?.status"
                class="text-uppercase"
                :class="{
                  'text-success':
                    currentUserKyc?.status == KycStatus.ACCEPT ||
                    currentUserKyc?.status == KycStatus.APPROVED_PAPER,
                  'text-danger':
                    currentUserKyc?.status == KycStatus.NEW ||
                    currentUserKyc?.status == KycStatus.REJECT,
                }"
              >
                {{ $t(`kycStatusValue.${currentUserKyc?.status}`) }}
              </span>
            </div>
          </template>
        </div>
      </Form>
    </div>
  </div>

  <user-note :userId="userId"></user-note>

  <admin-kyc-decisions :userKyc="userKyc"></admin-kyc-decisions>

  <rejection-reason
    :show="showRejectionReasonModal"
    :reason-type="rejectionReasonType"
    :loading="loading.submit"
    @close="showRejectionReasonModal = false"
    @submit="reject"
  ></rejection-reason>

  <info-history
    :currentUserInfo="currentUserInfo"
    :currentUserKyc="currentUserKyc"
    :show="showInfoHistory"
    @close="showInfoHistory = false"
    @selectHistory="selectHistory"
    @selectCurrentVersion="selectCurrentVersion"
  ></info-history>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserService } from '@/services/UserService'
import { User, UserKycVerifyStatus, UserStatus } from '@/models/user/User'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import {
  KycStatus,
  KycType,
  ReviewOcrRequest,
  UserKyc,
  UserKycHistory,
} from '@/models/user/UserKyc'
import { UserInfoService } from '@/services/UserInfoService'
import { UserKycService } from '@/services/UserKycService'
import RejectionReason from '@/components/modals/RejectionReason.vue'
import { DuplicateFaceStatus } from '@/models/user/UserKycScanData'
import { Expose, instanceToPlain, plainToInstance } from 'class-transformer'
import { Field, Form } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { Optional } from '@/models/common/Optional'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Mutations } from '@/store/enums/StoreEnums'
import InfoHistory from '@/components/user/InfoHistory.vue'
import {
  checkPermission,
  formatServerErrors,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { Permission, SubErrorCode } from '@/core/variables/common.enum'
import ImageProcessResultComponent from '@/components/user/image-process-result/ImageProcessResultComponent.vue'
import AdminKycDecisions from '@/components/user/AdminKycDecisions.vue'
import UserNote from '@/components/user/UserNote.vue'
import BanBtn from '@/components/user/BanBtn.vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'

class ReviewOcrForm {
  @Expose({ name: 'compare_birthday' })
  compareBirthday = 0

  @Expose({ name: 'compare_document_type' })
  compareDocumentType = 0

  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie = 0

  @Expose({ name: 'compare_name' })
  compareName = 0

  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  get canAccept() {
    return (
      this.compareBirthday == 1 &&
      this.compareDocumentType == 1 &&
      this.compareLivenessSelfie == 1 &&
      this.compareName == 1 &&
      this.idDocumentNo
    )
  }
}

export default defineComponent({
  components: {
    RejectionReason,
    Form,
    Field,
    ErrorDisplay,
    InfoHistory,
    ImageProcessResultComponent,
    AdminKycDecisions,
    UserNote,
    BanBtn,
  },
  name: 'review-ocr',
  mounted() {
    setCurrentPageBreadcrumbs('userInformationVerification', ['users'])
    this.getData()
  },
  watch: {
    '$route.query.user_id': function () {
      this.getData()
    },
  },
  data: () => ({
    user: null as Optional<User>,
    userInfo: null as Optional<UserInfo | UserInfoHistory>,
    userKyc: null as Optional<UserKyc | UserKycHistory>,
    currentUserInfo: null as Optional<UserInfo>,
    currentUserKyc: null as Optional<UserKyc>,
    form: {} as ReviewOcrForm,
    showRejectionReasonModal: false,
    showInfoHistory: false,
    loading: {
      submit: false,
    },
    DuplicateFaceStatus,
    KycStatus,
    Permission,
    UserStatus,
  }),
  computed: {
    userId() {
      return this.$route.query.user_id as string
    },
    readOnly() {
      return (
        !this.currentUserKyc ||
        (this.currentUserKyc.status != KycStatus.PENDING_PAPER &&
          this.currentUserKyc.status != KycStatus.AUTO_KYC_PROCESSED)
      )
    },
    rejectionReasonType() {
      return !this.currentUserKyc ||
        this.currentUserKyc.type == KycType.PERSONAL
        ? ReasonCategoryTypeEnum.KYC_PERSONAL
        : ReasonCategoryTypeEnum.KYC_ENTERPRISE
    },
    isCurrentInfoVersion() {
      return this.currentUserInfo == this.userInfo
    },
    isCurrentKycVersion() {
      return this.currentUserKyc == this.userKyc
    },
  },
  methods: {
    async getUser() {
      this.user = await UserService.findById(this.userId)
    },
    async getUserInfo() {
      this.currentUserInfo = await UserInfoService.findByUserId(this.userId)
      this.userInfo = this.currentUserInfo
    },
    async getUserKyc() {
      this.currentUserKyc = await UserKycService.findKycByUserId(this.userId)
      this.userKyc = this.currentUserKyc
    },
    async getData() {
      if (!this.userId) return
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      await this.getUser()
      if (
        !this.user ||
        this.user.kycVerifyStatus == UserKycVerifyStatus.UNVERIFIED
      ) {
        return this.$router.replace({ name: '404' })
      }
      await Promise.all([this.getUserInfo(), this.getUserKyc()])

      this.form = plainToInstance(ReviewOcrForm, this.currentUserKyc || {}, {
        ignoreDecorators: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      })
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    async reject(reasons) {
      const selectedReasons = reasons.map((reason) => ({
        reason_category_id: reason.categoryId,
        reason_category_name_en: reason.category?.en,
        reason_category_name_ja: reason.category?.ja,
        rejection_reason_id: reason.reasonId,
        rejection_reason_name_en: reason.reason?.en,
        rejection_reason_name_ja: reason.reason?.ja,
        category_id: reason.categoryId,
        reason_id: reason.reasonId,
      }))
      await this.submit(KycStatus.REJECT, selectedReasons)
    },
    async accept() {
      await this.submit(KycStatus.ACCEPT)
    },
    async pending() {
      await this.submit(KycStatus.PENDING_PAPER)
    },
    async submit(status: number, rejectionReasons?) {
      this.loading.submit = true
      const res = await UserKycService.reviewOcr(
        plainToInstance(ReviewOcrRequest, {
          ...instanceToPlain(this.form),
          status,
          rejection_reasons: rejectionReasons,
          user_id: this.userId,
        }),
      )

      if (res?.success) {
        this.$toastr.success(this.$t('success'))
        this.$router.back()
      } else {
        this.$toastr.error(this.$t(res?.message || 'serverError'))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
      this.loading.submit = false
    },
    selectHistory(history: UserInfoHistory) {
      this.userKyc = history.userKycHistory
      this.userInfo = history
    },
    selectCurrentVersion() {
      this.userKyc = this.currentUserKyc
      this.userInfo = this.currentUserInfo
    },
    tagChanged(tag: string) {
      return this.userInfo && this.userInfo.tagChanged(tag)
    },
    checkPermission,
  },
})
</script>

<style lang="scss" scoped>
.checklist-section {
  .checklist-label {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    margin-right: 30px;
    cursor: pointer;
    .checklist-radio {
      margin-right: 5px;
    }
  }
}
</style>
