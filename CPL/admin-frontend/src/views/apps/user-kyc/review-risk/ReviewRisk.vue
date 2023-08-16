<template>
  <div class="card mb-5">
    <div class="card-header pt-2">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <div class="card-title page-header text-header d-block">
          [{{ $t('identificationVerificationDocument') }}]
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
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
        role="tablist"
      >
        <li class="nav-item">
          <a
            class="nav-link active"
            data-bs-toggle="tab"
            href="#information-tab"
            role="tab"
          >
            {{ $t('information') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-bs-toggle="tab"
            href="#screening-tab"
            role="tab"
          >
            {{ $t('screening') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-bs-toggle="tab"
            href="#risk-report-tab"
            role="tab"
          >
            {{ $t('riskReport') }}
          </a>
        </li>
        <li class="nav-item ms-auto">
          <router-link
            v-if="user?.id"
            class="btn btn-sm btn-primary ms-auto mb-2 me-2"
            :to="{ name: 'user.detail', params: { id: user.id } }"
          >
            {{ $t('menu.basicInfo') }}
          </router-link>
          <button
            class="btn btn-sm btn-primary mb-2"
            @click="showInfoHistory = true"
          >
            <span class="d-none d-md-block">{{ $t('versionHistory') }}</span>
            <i class="fas fa-history d-inline-flex d-md-none"></i>
          </button>
        </li>
      </ul>
      <div class="tab-content py-8 border-start border-end border-bottom px-6">
        <div class="tab-pane active" id="information-tab">
          <enterprise-information-screen
            v-if="userKyc?.type == KycType.ENTERPRISE"
            :userInfo="userInfo"
            :userKyc="userKyc"
            :enterpriseInfo="enterpriseInfo"
          ></enterprise-information-screen>
          <personal-information-screen
            v-else
            :userInfo="userInfo"
            :userKyc="userKyc"
          ></personal-information-screen>
        </div>

        <div class="tab-pane" id="screening-tab">
          <screening-screen
            :cynopsis="cynopsis"
            :userInfo="userInfo"
            @renewCynopsisData="getUserKycCynopsis"
            :loadingCynopsis="loadingCynopsis"
          ></screening-screen>
        </div>

        <div class="tab-pane" id="risk-report-tab">
          <risk-report-screen
            :cynopsis="cynopsis"
            :userKyc="userKyc"
            :currentUserKyc="currentUserKyc"
            :loadingCynopsis="loadingCynopsis"
            :isCurrentKycVersion="isCurrentKycVersion"
          ></risk-report-screen>
        </div>
      </div>
    </div>
  </div>

  <div
    class="card mb-5"
    v-if="isCurrentKycVersion && currentUserKyc?.needShowRejectionReasons"
  >
    <div class="card-header">
      <div class="card-title m-0 text-uppercase fw-bold">
        {{ $t('rejectionReasons') }}
      </div>
    </div>

    <div class="card-body pt-4">
      <ul class="mb-0">
        <li v-for="(reason, i) in currentUserKyc?.rejectionReasons" :key="i">
          {{ reason.nameByLocale }}
        </li>
      </ul>
    </div>
  </div>

  <user-note :userId="userId"></user-note>

  <admin-kyc-decisions :userKyc="userKyc"></admin-kyc-decisions>

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
  UserKyc,
  UserKycHistory,
  RiskRating,
} from '@/models/user/UserKyc'
import { UserInfoService } from '@/services/UserInfoService'
import { UserKycService } from '@/services/UserKycService'
import { UserKycCynopsis } from '@/models/user/UserKycScanData'
import PersonalInformationScreen from './PersonalInformationScreen.vue'
import EnterpriseInformationScreen from './EnterpriseInformationScreen.vue'
import { Optional } from '@/models/common/Optional'
import { EnterpriseInfo } from '@/models/user/EnterpriseInfo'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import ScreeningScreen from './screening-screen/ScreeningScreen.vue'
import RiskReportScreen from './RiskReportScreen.vue'
import { Mutations } from '@/store/enums/StoreEnums'
import InfoHistory from '@/components/user/InfoHistory.vue'
import { checkPermission } from '@/core/helpers/common.helper'
import { Permission } from '@/core/variables/common.enum'
import AdminKycDecisions from '@/components/user/AdminKycDecisions.vue'
import UserNote from '@/components/user/UserNote.vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import BanBtn from '@/components/user/BanBtn.vue'

export default defineComponent({
  components: {
    PersonalInformationScreen,
    EnterpriseInformationScreen,
    ScreeningScreen,
    RiskReportScreen,
    InfoHistory,
    AdminKycDecisions,
    UserNote,
    BanBtn,
  },
  name: 'review-risk-report',
  mounted() {
    setCurrentPageBreadcrumbs('identificationVerificationDocument', ['users'])
    this.getData()
  },
  watch: {
    '$route.query.user_id': function () {
      this.getData()
    },
    'userKyc.userKycHistoryId': async function () {
      await this.getUserKycCynopsis()
    },
  },
  data: () => ({
    user: null as Optional<User>,
    userInfo: null as Optional<UserInfo | UserInfoHistory>,
    userKyc: null as Optional<UserKyc | UserKycHistory>,
    currentUserInfo: null as Optional<UserInfo>,
    currentUserKyc: null as Optional<UserKyc>,
    enterpriseInfo: null as Optional<EnterpriseInfo>,
    cynopsis: null as Optional<UserKycCynopsis>,
    showRejectionReasonModal: false,
    showInfoHistory: false,
    loadingCynopsis: false,
    KycStatus,
    KycType,
    RiskRating,
    Permission,
    UserStatus,
  }),
  computed: {
    userId() {
      return this.$route.query.user_id as string
    },
    rejectionReasonType() {
      return !this.userKyc || this.userKyc.type == KycType.PERSONAL
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
    checkPermission,
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
    async getEnterpriseInfo() {
      this.enterpriseInfo = await UserKycService.findEnterpriseInfoByUserId(
        this.userId,
      )
    },
    async getUserKycCynopsis() {
      if (!this.userKyc) return
      this.loadingCynopsis = true
      this.cynopsis = await UserKycService.findCynopsisByKycHistoryId(
        this.userKyc.userKycHistoryId,
      )
      this.loadingCynopsis = false
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

      if (
        !this.currentUserKyc ||
        this.currentUserKyc.status == KycStatus.NEW ||
        this.currentUserKyc.status == KycStatus.AUTO_KYC_PROCESSED ||
        this.currentUserKyc.status == KycStatus.PENDING_PAPER
      ) {
        return this.$router.replace({ name: '404' })
      }

      if (this.currentUserKyc.type == KycType.ENTERPRISE) {
        await this.getEnterpriseInfo()
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    selectHistory(history: UserInfoHistory) {
      this.userKyc = history.userKycHistory
      this.userInfo = history
    },
    selectCurrentVersion() {
      this.userKyc = this.currentUserKyc
      this.userInfo = this.currentUserInfo
    },
  },
})
</script>

<style lang="scss" scoped></style>
