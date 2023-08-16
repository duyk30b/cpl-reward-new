<template>
  <div class="card mb-5">
    <div class="card-header pt-2">
      <div class="card-title page-header text-header d-block">
        [{{ $t('userInformationDetail') }}] {{ user?.email }}
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

      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-sm btn-primary me-3"
          v-if="currentUserInfo && checkPermission(Permission.USER_INFO_UPDATE)"
          @click="showUpdateInfoModal"
        >
          {{ $t('edit') }}
        </button>
        <ban-btn
          :userId="userId"
          :isBanned="user?.isBanned"
          @banStatusChange="($event) => (user.isBanned = $event)"
        ></ban-btn>
      </div>
    </div>

    <div class="card-body pt-4">
      <el-tabs v-model="selectTab" @tab-click="handleClick">
        <el-tab-pane :label="$t('information')" name="information">
          <div class="section-block">
            <div class="d-flex align-items-center">
              <div v-if="user?.accountLv == 1">
                {{ $t('user.notHaveEmail') }}
              </div>
              <div v-else class="text-nowrap">
                <span class="fw-bold">{{ $t('email') }}: </span>
                {{ user?.email }}
                <button
                  type="button"
                  class="btn btn-sm btn-primary ms-3 me-1"
                  v-if="
                    user?.status == UserStatus.ACTIVE &&
                    checkPermission(Permission.USER_CHANGE_EMAIL)
                  "
                  @click="modal.changeEmail = true"
                >
                  <span class="d-none d-md-block">{{ $t('changeEmail') }}</span>
                  <i class="fas fa-pen d-inline-flex d-md-none"></i>
                </button>
              </div>
              <div class="ms-auto">
                <router-link
                  class="btn btn-sm btn-primary ms-auto me-1"
                  v-if="
                    isCurrentInfoVersion &&
                    user?.accountLv > 2 &&
                    userKyc &&
                    userKyc.status != KycStatus.NEW
                  "
                  :to="{
                    name:
                      userKyc.status == KycStatus.AUTO_KYC_PROCESSED ||
                      userKyc.status == KycStatus.PENDING_PAPER
                        ? 'userKyc.reviewOcr'
                        : 'userKyc.reviewRisk',
                    query: { user_id: user?.id },
                  }"
                >
                  {{ $t('kyc') }}
                </router-link>
                <button
                  v-if="
                    checkPermission(Permission.USER_EMAIL_CHANGE_HISTORY_READ)
                  "
                  class="btn btn-sm btn-primary me-1"
                  @click="modal.emailHistory = true"
                  :title="$t('emailHistory')"
                >
                  <span class="d-none d-md-block">
                    {{ $t('emailHistory') }}
                  </span>
                  <i class="fas fa-history d-inline-flex d-md-none"></i>
                </button>
                <button
                  v-if="checkPermission(Permission.TOGGLE_BAN_USER)"
                  class="btn btn-sm btn-primary me-1"
                  @click="modal.blacklistHistory = true"
                  :title="$t('userBlacklistHistory')"
                >
                  <span class="d-none d-md-block">
                    {{ $t('userBlacklistHistory') }}
                  </span>
                  <i class="fas fa-history d-inline-flex d-md-none"></i>
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  @click="showInfoHistory = true"
                  :title="$t('kycHistory')"
                >
                  <span class="d-none d-md-block">
                    {{ $t('kycHistory') }}
                  </span>
                  <i class="fas fa-history d-inline-flex d-md-none"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="section-block" v-if="isCurrentInfoVersion">
            <div class="section-header">
              {{ $t('accountLevel') }}
            </div>
            <div class="info-section">
              <div class="info-field">
                <label class="label">{{ $t('level') }}</label>
                <div class="value">{{ user?.accountLv }}</div>
              </div>
              <div class="info-field">
                <label class="label">{{ $t('levelStatus') }}</label>
                <div class="value">
                  {{
                    parseAccountLevelStatus(user?.accountLv, userKyc?.status)
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="section-block" v-if="userKyc">
            <div class="section-header">
              {{ $t('identificationDocument') }}
            </div>
            <div class="fw-bold mb-2">
              {{ $t('idNumber') }}:
              <span :class="{ 'tag-changed': tagChanged('idDocumentNo') }">
                {{ userKyc.idDocumentNo || '-' }}
              </span>
            </div>
            <div class="row mb-4">
              <div
                class="col-xl-3 col-lg-4 col-md-6 text-center pb-2"
                v-for="(img, index) in userKyc.imageFiles"
                :key="index"
                :class="{ 'tag-changed': tagChanged('files') }"
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
            <div
              class="border-bottom mb-5 info-section"
              v-if="checkPermission(Permission.USER_KYC_READ_SCAN_DATA)"
            >
              <image-process-result-component
                :userKyc="userKyc"
              ></image-process-result-component>
            </div>
          </div>
          <div class="section-block" v-if="userInfo">
            <div class="row mb-4 info-section">
              <div class="col-xl-6">
                <div class="section-header">
                  {{ $t('customerInformation') }}
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('nationality') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('nationalityId') }"
                  >
                    {{ $filters.getCountryName(userInfo.nationalityId) }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">
                    {{ $t('firstName') }}/{{ $t('givenName') }}
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
                    {{ $t('lastName') }}/{{ $t('surname') }}
                  </label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('lastName') }"
                  >
                    {{ userInfo.lastName }}
                  </div>
                </div>
                <div
                  class="info-field"
                  v-if="userInfo.nationalityId == JAPAN_ID"
                >
                  <label class="label">
                    {{ $t('furigana') }}
                  </label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('furigana') }"
                  >
                    {{ userInfo.furigana1 }} {{ userInfo.furigana2 }}
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
                  <label class="label">{{ $t('gender') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('gender') }"
                  >
                    {{ $t('genderValue.' + userInfo.gender) }}
                  </div>
                </div>
                <div v-if="userKyc" class="mt-5 mb-4">
                  <label class="fs-4 fw-bold text-uppercase mb-3">
                    {{ $t('remarks') }}
                  </label>
                  <textarea
                    v-model="userKyc.remark"
                    class="form-control"
                    disabled
                  ></textarea>
                </div>
              </div>
              <div class="col-xl-6">
                <div class="section-header">
                  {{ $t('currentAddress') }} ({{ $t('registeredAddress') }})
                </div>
                <div class="info-field">
                  <label class="label">
                    {{ $t('building') }}/{{ $t('room') }}
                  </label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('buildingRoom') }"
                  >
                    {{ userInfo.buildingRoom }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('address') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('address') }"
                  >
                    {{ userInfo.address }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('city') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('city') }"
                  >
                    {{ userInfo.city }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">
                    {{ $t('state') }}/{{ $t('region') }}
                  </label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('stateRegion') }"
                  >
                    {{ userInfo.stateRegion }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('zipCode') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('zipCode') }"
                  >
                    {{ userInfo.zipCode }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('country') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('countryId') }"
                  >
                    {{ $filters.getCountryName(userInfo.countryId) }}
                  </div>
                </div>
                <div class="info-field">
                  <label class="label">{{ $t('phoneNumber') }}</label>
                  <div
                    class="value"
                    :class="{ 'tag-changed': tagChanged('phoneNumber') }"
                  >
                    {{ userInfo.phoneNumber }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fw-bold fs-3">
            {{ $t('googleAuthenticatorStatus') }}:
            {{
              $t(
                'authenticatorVerifyStatusValue.' +
                  user?.authenticatorVerifyStatus,
              )
            }}
            <button
              type="button"
              class="btn btn-sm btn-light-primary ms-3"
              @click="confirmResetAuthenticator"
              :disabled="loading.resetAuthenticator"
              v-if="
                checkPermission(Permission.USER_AUTHENTICATOR_RESET) &&
                user?.authenticatorVerifyStatus ==
                  UserAuthenticatorVerifyStatus.VERIFIED
              "
            >
              {{ $t('reset') }}
            </button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('wallet')" name="wallet">
          Developing
        </el-tab-pane>
        <el-tab-pane
          :label="$t('userBalance.userBalance')"
          name="userBalance"
          v-if="checkPermission(Permission.BALANCE_READ)"
        >
          <UserBalance v-if="selectTab === 'userBalance'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('userBalance.balanceHistory')"
          name="balanceHistory"
          v-if="checkPermission(Permission.BALANCE_HISTORY)"
        >
          <BalanceHistory v-if="selectTab === 'balanceHistory'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('userBalance.transferBalance')"
          name="transferBalance"
          v-if="checkPermission(Permission.BALANCE_TRANSFER_SELF_TRANSFER)"
        >
          <TransferBalance v-if="selectTab === 'transferBalance'" />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('userBalance.balanceMonitoring')"
          name="balanceMonitoring"
          v-if="checkPermission(Permission.BALANCE_ABNORMAL_READ)"
        >
          <BalanceMonitoring
            v-if="selectTab === 'balanceMonitoring' && user"
            :user="user"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('dividend')" name="dividend">
          <DividendInputCode />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <user-note :userId="userId"></user-note>

  <admin-kyc-decisions
    v-if="
      checkPermission(Permission.USER_KYC_READ_ADMIN_DECISIONS) &&
      selectTab == 'information'
    "
    :userKyc="userKyc"
  ></admin-kyc-decisions>

  <info-history
    :currentUserInfo="currentUserInfo"
    :currentUserKyc="currentUserKyc"
    :show="showInfoHistory"
    @close="showInfoHistory = false"
    @selectHistory="selectHistory"
    @selectCurrentVersion="selectCurrentVersion"
  ></info-history>
  <email-history
    :userId="userId"
    :show="modal.emailHistory"
    @close="modal.emailHistory = false"
  ></email-history>
  <change-email
    :user="user"
    :show="modal.changeEmail"
    @close="modal.changeEmail = false"
    @submited="getUser"
  ></change-email>
  <update-info-modal
    :userId="userId"
    :show="modal.updateInfo"
    @close="modal.updateInfo = false"
    @infoUpdated="getData"
  ></update-info-modal>

  <user-blacklist-history
    :userId="userId"
    :show="modal.blacklistHistory"
    @close="modal.blacklistHistory = false"
  ></user-blacklist-history>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserService } from '@/services/UserService'
import {
  User,
  UserAuthenticatorVerifyStatus,
  UserStatus,
} from '@/models/user/User'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import { KycStatus, UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import { UserInfoService } from '@/services/UserInfoService'
import { UserKycService } from '@/services/UserKycService'
import { Optional } from '@/models/common/Optional'
import {
  checkPermission,
  parseAccountLevelStatus,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Actions, Mutations } from '@/store/enums/StoreEnums'
import InfoHistory from '@/components/user/InfoHistory.vue'
import EmailHistory from '@/components/user/EmailHistory.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import UserBalance from '@/components/user/UserBalance.vue'
import BalanceHistory from '@/components/user/BalanceHistory.vue'
import TransferBalance from '@/components/user/TransferBalance.vue'
import BalanceMonitoring from '@/components/user/BalanceMonitoring.vue'
import { Permission } from '@/core/variables/common.enum'
import ImageProcessResultComponent from '@/components/user/image-process-result/ImageProcessResultComponent.vue'
import AdminKycDecisions from '@/components/user/AdminKycDecisions.vue'
import UserNote from '@/components/user/UserNote.vue'
import { ElMessageBox } from 'element-plus'
import DividendInputCode from '@/components/user/DividendInputCode.vue'
import CONFIG from '@/config'
import UpdateInfoModal from './UpdateInfoModal.vue'
import UserBlacklistHistory from '@/components/user/UserBlacklistHistory.vue'
import BanBtn from '@/components/user/BanBtn.vue'

export default defineComponent({
  name: 'user-detail',
  components: {
    InfoHistory,
    EmailHistory,
    UserBalance,
    TransferBalance,
    BalanceHistory,
    BalanceMonitoring,
    ImageProcessResultComponent,
    AdminKycDecisions,
    UserNote,
    DividendInputCode,
    ChangeEmail,
    UpdateInfoModal,
    UserBlacklistHistory,
    BanBtn,
  },
  mounted() {
    setCurrentPageBreadcrumbs('userInformationDetail', ['users'])
    this.getData()
    if (!this.$store.getters.listCoin.length) {
      this.$store.dispatch(Actions.FETCH_LIST_COIN)
    }
    if (this.$route.params.tab) {
      this.selectTab = this.$route.params.tab as string
    }
  },
  watch: {
    '$route.params.id': function () {
      this.getData()
    },
  },
  data: () => ({
    user: null as Optional<User>,
    userInfo: null as Optional<UserInfo | UserInfoHistory>,
    userKyc: null as Optional<UserKyc | UserKycHistory>,
    currentUserInfo: null as Optional<UserInfo>,
    currentUserKyc: null as Optional<UserKyc>,
    showInfoHistory: false,
    modal: {
      emailHistory: false,
      changeEmail: false,
      updateInfo: false,
      blacklistHistory: false,
    },
    Permission,
    UserStatus,
    selectTab: 'information',
    UserAuthenticatorVerifyStatus,
    loading: {
      resetAuthenticator: false,
      submit: false,
    },
    KycStatus,
    JAPAN_ID: CONFIG.JAPAN_ID,
  }),
  computed: {
    userId() {
      return this.$route.params.id as string
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
      if (!this.user?.id) return this.$router.replace({ name: '404' })
      await Promise.all([this.getUserInfo(), this.getUserKyc()])
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
    tagChanged(tag: string) {
      return this.userInfo && this.userInfo.tagChanged(tag)
    },
    parseAccountLevelStatus,
    checkPermission,
    confirmResetAuthenticator() {
      if (!this.user) return
      ElMessageBox.confirm(this.$t('confirmAction'), this.$t('confirm'), {
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
        type: 'warning',
      }).then(async () => {
        await this.resetAuthenticator()
      })
    },
    async resetAuthenticator() {
      this.loading.resetAuthenticator = true
      const res = await UserService.resetAuthenticator(this.userId)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        await this.getUser()
      } else {
        this.$toastr.error(this.$t(res.message || 'serverError'))
      }
      this.loading.resetAuthenticator = false
    },
    showUpdateInfoModal() {
      this.modal.updateInfo = true
    },
  },
})
</script>
