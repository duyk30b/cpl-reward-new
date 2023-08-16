<template>
  <div
    class="mb-0 h-100"
    data-kt-sticky="true"
    data-kt-sticky-name="subscription-summary"
    data-kt-sticky-offset="{default: false}"
    data-kt-sticky-width="{lg: '300px', xl: '350px'}"
    data-kt-sticky-left="auto"
    data-kt-sticky-top="70px"
    data-kt-sticky-animation="false"
    data-kt-sticky-zindex="95"
  >
    <!--begin::Card-->
    <div class="card card-flush">
      <!--begin::Card body-->
      <div class="card-body pt-0 fs-6 mt-2">
        <form @submit="saveCampaign">
          <!--begin::Section-->
          <div class="mb-7 pt-2">
            <div class="fv-row">
              <!--begin::Wrapper-->
              <div class="d-flex flex-stack">
                <div class="me-5">
                  <label class="fs-6 fw-bold">{{ $t('active') }}?</label>
                </div>
                <label
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    name="status"
                    type="checkbox"
                    id="kt_campaign_active"
                    v-model="campaign.isActive"
                    true-value="1"
                    false-value="0"
                  />
                  <span class="form-check-label fw-bold text-muted">
                    <template
                      v-if="
                        campaign.isActive &&
                        parseInt(campaign.isActive.toString()) === 1
                      "
                    >
                      {{ $t('yes') }}
                    </template>
                    <template v-else>{{ $t('no') }}</template>
                  </span>
                </label>
              </div>
              <!--begin::Wrapper-->
            </div>

            <button
              class="btn btn-icon btn-active-light-primary me-2"
              @click.prevent="switchLanguage('en')"
              :class="{ active: currentLanguage == 'en' }"
            >
              <span class="svg-icon svg-icon-3 m-0">
                <inline-svg src="media/flags/united-states.svg" />
              </span>
            </button>
            <button
              class="btn btn-icon btn-active-light-primary"
              @click.prevent="switchLanguage('jp')"
              :class="{ active: currentLanguage == 'jp' }"
            >
              <span class="svg-icon svg-icon-3 m-0">
                <inline-svg src="media/flags/japan.svg" />
              </span>
            </button>
            <!--begin::English info input-->
            <div v-show="currentLanguage === 'en'">
              <label class="col-lg-12 fw-bold text-muted mt-2">
                Campaign name
              </label>
              <input
                required
                type="text"
                class="form-control form-control-sm px-5"
                name="name"
                placeholder="Campaign name"
                v-model="campaign.title"
                @invalid="switchLanguage('en')"
                maxlength="255"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                Short description
              </label>
              <textarea
                required
                type="text"
                class="form-control form-control-sm px-5"
                name="description"
                placeholder="Short description"
                v-model="campaign.description"
                @invalid="switchLanguage('en')"
                maxlength="65535"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                Image link
              </label>
              <input
                required
                type="url"
                class="form-control form-control-sm px-5"
                name="image"
                placeholder="Image link"
                v-model="campaign.campaignImage"
                @invalid="switchLanguage('en')"
                maxlength="255"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                Notification link
              </label>
              <input
                required
                type="url"
                class="form-control form-control-sm px-5"
                name="notification_link"
                placeholder="Notification link"
                v-model="campaign.notificationLink"
                @invalid="switchLanguage('en')"
                maxlength="65535"
              />
            </div>
            <!--end::English info input-->
            <!--begin::Japan info input-->
            <div v-show="currentLanguage === 'jp'">
              <label class="col-lg-12 fw-bold text-muted mt-2">
                キャンペーン名
              </label>
              <input
                required
                type="text"
                class="form-control form-control-sm px-5"
                name="name_ja"
                placeholder="キャンペーン名"
                v-model="campaign.titleJa"
                @invalid="switchLanguage('jp')"
                maxlength="255"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                簡単な説明
              </label>
              <textarea
                required
                type="text"
                class="form-control form-control-sm px-5"
                name="description_ja"
                placeholder="簡単な説明"
                v-model="campaign.descriptionJa"
                @invalid="switchLanguage('jp')"
                maxlength="65535"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                画像リンク
              </label>
              <input
                required
                type="url"
                class="form-control form-control-sm px-5"
                name="image_ja"
                placeholder="画像リンク"
                v-model="campaign.campaignImageJa"
                @invalid="switchLanguage('jp')"
                maxlength="255"
              />

              <label class="col-lg-12 fw-bold text-muted mt-2">
                通知リンク
              </label>
              <input
                required
                type="url"
                class="form-control form-control-sm px-5"
                name="notification_link_ja"
                placeholder="通知リンク"
                v-model="campaign.notificationLinkJa"
                @invalid="switchLanguage('jp')"
                maxlength="65535"
              />
            </div>
            <!--end::Japn info input-->
            <label class="col-lg-12 fw-bold text-muted mt-2">
              {{ $t('priorityOrder') }}
            </label>
            <input
              required
              type="number"
              class="form-control form-control-sm px-5"
              name="priority"
              :placeholder="$t('priorityOrder')"
              v-model="campaign.priority"
              min="0"
              max="2147483647"
            />
          </div>
          <!--end::Section-->

          <!--begin::Seperator-->
          <!--      <div class="separator separator-dashed mb-7"></div>-->
          <!--end::Seperator-->

          <!--begin::Section-->
          <div class="mb-4">
            <!--begin::Title-->
            <!--        <h5 class="mb-3">Limited money and time</h5>-->
            <!--end::Title-->
            <Limit
              :prop-limit="limitOption"
              @updated="updateLimitOption"
            ></Limit>
          </div>
          <div
            class="mb-8 mt-8"
            :class="{ 'overlay overlay-block': campaign.isLock }"
          >
            <div
              v-if="campaign.isLock"
              class="overlay-layer bg-dark bg-opacity-5"
              :style="{ zIndex: 999 }"
            />
            <p class="fw-bold text-muted mt-3 mb-0">
              {{ $t('type') }}
            </p>
            <el-radio-group
              v-model="campaign.type"
              :disabled="!!campaign.id"
              class="ml-4"
            >
              <el-radio :label="CAMPAIGN_TYPE.DEFAULT" size="large">{{
                $t('campaignDefault')
              }}</el-radio>
              <el-radio :label="CAMPAIGN_TYPE.ORDER" size="large">{{
                $t('campaignDaily')
              }}</el-radio>
            </el-radio-group>
            <div v-if="campaign.type === CAMPAIGN_TYPE.ORDER">
              <label class="col-lg-12 fw-bold text-muted">
                {{ $t('resetDailyTime') }}
              </label>
              <input
                required
                type="time"
                class="form-control form-control-sm"
                v-model="campaign.resetTime"
              />
            </div>
          </div>
          <!--end::Section-->

          <!--begin::Section-->
          <div
            class="fv-row mb-4"
            v-if="campaign.type === CAMPAIGN_TYPE.DEFAULT"
          >
            <!--begin::Wrapper-->
            <div class="d-flex flex-stack">
              <div class="me-5">
                <label class="fs-6 fw-bold">{{ $t('hiddenFromUser') }}</label>
              </div>
              <label
                class="form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="status"
                  type="checkbox"
                  id="kt_campaign_active"
                  v-model="campaign.isHidden"
                  true-value="1"
                  false-value="0"
                />
                <span class="form-check-label fw-bold text-muted">
                  <template
                    v-if="
                      campaign.isHidden &&
                      parseInt(campaign.isHidden.toString()) === 1
                    "
                  >
                    {{ $t('yes') }}
                  </template>
                  <template v-else>{{ $t('no') }}</template>
                </span>
              </label>
            </div>
            <!--begin::Wrapper-->
          </div>
          <!--end::Section-->

          <!--begin::Seperator-->
          <!--      <div class="separator separator-dashed mb-7"></div>-->
          <!--end::Seperator-->

          <!--begin::Actions-->
          <div class="mb-0">
            <button
              type="submit"
              class="btn btn-primary w-100"
              id="kt_campaign_create_button"
              :data-kt-indicator="loading ? 'on' : null"
              :disabled="loading"
            >
              <!--begin::Indicator-->
              <span class="indicator-label">{{ $t('saveCampaign') }}</span>
              <span class="indicator-progress">
                {{ $t('pleaseWait') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                >
                </span>
              </span>
              <!--end::Indicator-->
            </button>
          </div>
          <!--end::Actions-->
        </form>
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
    <div class="mt-8 d-none d-lg-block list-mission-index">
      <el-timeline class="list-mission-timeline">
        <el-timeline-item
          v-for="(mission, idx) in missions"
          :key="idx"
          type="primary"
          :color="mission.isModified ? '#ffc700' : ''"
        >
          <a
            href=""
            @click="onClickIndex('kt_mission_' + idx, $event)"
            :class="{ 'link-warning': mission.isModified }"
          >
            {{
              campaign.type === CAMPAIGN_TYPE.ORDER ? `Day ${idx + 1} - ` : ''
            }}
            {{ mission.fullTitle ?? $t('untitled') }}
          </a>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Campaign, { CAMPAIGN_TYPE } from '@/core/data/campaign/campaign'
import MissionEntity from '@/core/data/campaign/judgment-condition'
import Limit from '@/components/campaigns/add/Limit.vue'
import ApiService from '@/core/services/ApiService'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import moment from 'moment'
import LimitOption from '@/core/data/campaign/limit-option'
import Swal from 'sweetalert2'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'campaign-summary',
  components: { Limit },
  data() {
    return {
      moment,
      campaign: new Campaign(),
      limitOption: new LimitOption(),
      currentLanguage: 'en',
      loading: false,
      CAMPAIGN_TYPE,
    }
  },
  props: {
    missions: Array as PropType<MissionEntity[]>,
    propCampaign: {
      type: Campaign,
      default: () => {
        return new Campaign()
      },
    },
  },
  watch: {
    propCampaign(newVal) {
      this.campaign = newVal

      // Convert limit option time
      this.limitOption.startDate = moment
        .unix(newVal.startDate)
        .format('YYYY-MM-DDTHH:mm')
      this.limitOption.endDate = moment
        .unix(newVal.endDate)
        .format('YYYY-MM-DDTHH:mm')
    },
    campaign: {
      handler(newVal) {
        this.$emit('updated', newVal)
      },
      deep: true,
    },
  },
  methods: {
    async saveCampaign(e) {
      e.preventDefault()
      if (this.campaign.id) {
        const { isConfirmed } = await Swal.fire({
          text: this.$t('confirmSaveMessage'),
          icon: 'question',
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: this.$t('save'),
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary',
          },
        })

        if (!isConfirmed) {
          return
        }

        this.loading = true
        const result = await ApiService.patch(
          `campaign/${this.campaign.id}`,
          instanceToPlain(this.campaign),
        )
        this.loading = false

        if (result.status == HttpStatus.OK) {
          this.$toastr.success(this.$t('success'))
          this.$emit('saved', plainToInstance(Campaign, result.data))
          return
        }

        if (result.data?.errors?.[0]?.property) {
          this.$toastr.error(
            'Please check field: ' + result.data.errors[0].property,
          )
          return
        }

        this.$toastr.error(this.$t(result.data.message))
        return
      }

      this.loading = true
      const result = await ApiService.post(
        'campaign',
        instanceToPlain(this.campaign),
      )
      this.loading = false
      if (result.status == HttpStatus.CREATED) {
        this.$emit('saved', result.data)
        return
      }

      if (!result || result.data.errors) {
        this.$toastr.error(
          'Please check field: ' + result.data.errors[0].property,
        )
        return
      }
      this.$toastr.error(this.$t(result.data.message))
    },
    updateLimitOption(newVal) {
      this.campaign.startDate = parseInt(moment(newVal.startDate).format('X'))
      this.campaign.endDate = parseInt(moment(newVal.endDate).format('X'))

      this.$forceUpdate()
    },
    onClickIndex(hash, event) {
      event.preventDefault()
      const el = document.getElementById(hash)

      if (el) {
        window.scrollTo({
          left: 0,
          top: el.offsetTop,
          behavior: 'smooth',
        })
      }
    },
    switchLanguage(language) {
      this.currentLanguage = language
    },
  },
})
</script>

<style lang="scss">
.list-mission-index {
  position: sticky;
  top: 70px;
}
.link-warning {
  color: #ffc700;
}
.list-mission-timeline {
  height: 90vh;
  overflow-x: auto;
}
</style>
