<template>
  <div class="p-6 bg-white">
    <form @submit="saveCampaign">
      <div class="d-flex flex-stack">
        <label class="fs-6 fw-bold">{{ $t('active') }}?</label>
        <label class="form-check form-switch form-check-custom form-check-solid">
          <input class="form-check-input" name="status" type="checkbox" v-model="campaign.isActive" />
          <span class="form-check-label fw-bold text-muted">
            {{ campaign.isActive ? $t('yes') : $t('no') }}
          </span>
        </label>
      </div>
      <div>
        <button
          class="btn btn-icon btn-active-light-primary me-2"
          @click.prevent="language = 'en'"
          :class="{ active: language == 'en' }"
        >
          <span class="svg-icon svg-icon-3 m-0">
            <inline-svg src="media/flags/united-states.svg" />
          </span>
        </button>
        <button
          class="btn btn-icon btn-active-light-primary"
          @click.prevent="language = 'jp'"
          :class="{ active: language == 'jp' }"
        >
          <span class="svg-icon svg-icon-3 m-0">
            <inline-svg src="media/flags/japan.svg" />
          </span>
        </button>
      </div>

      <div v-show="language === 'en'">
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> Campaign name </label>
          <input
            required
            type="text"
            class="form-control form-control-sm px-5"
            name="name"
            placeholder="Campaign name"
            v-model="campaign.title"
            @invalid="language = 'en'"
            maxlength="255"
          />
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> Short description </label>
          <textarea
            required
            type="text"
            class="form-control form-control-sm px-5"
            name="description"
            placeholder="Short description"
            v-model="campaign.description"
            @invalid="language = 'en'"
            maxlength="65535"
          ></textarea>
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> Image link </label>
          <input
            required
            type="url"
            class="form-control form-control-sm px-5"
            name="image"
            placeholder="Image link"
            v-model="campaign.campaignImage"
            @invalid="language = 'en'"
            maxlength="255"
          />
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> Notification link </label>
          <input
            required
            type="url"
            class="form-control form-control-sm px-5"
            name="notification_link"
            placeholder="Notification link"
            v-model="campaign.notificationLink"
            @invalid="language = 'en'"
            maxlength="65535"
          />
        </div>
      </div>
      <div v-show="language === 'jp'">
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> キャンペーン名 </label>
          <input
            required
            type="text"
            class="form-control form-control-sm px-5"
            name="name_ja"
            placeholder="キャンペーン名"
            v-model="campaign.titleJa"
            @invalid="language = 'jp'"
            maxlength="255"
          />
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> 簡単な説明 </label>
          <textarea
            required
            type="text"
            class="form-control form-control-sm px-5"
            name="description_ja"
            placeholder="簡単な説明"
            v-model="campaign.descriptionJa"
            @invalid="language = 'jp'"
            maxlength="65535"
          ></textarea>
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> 画像リンク </label>
          <input
            required
            type="url"
            class="form-control form-control-sm px-5"
            name="image_ja"
            placeholder="画像リンク"
            v-model="campaign.campaignImageJa"
            @invalid="language = 'jp'"
            maxlength="255"
          />
        </div>
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> 通知リンク </label>
          <input
            required
            type="url"
            class="form-control form-control-sm px-5"
            name="notification_link_ja"
            placeholder="通知リンク"
            v-model="campaign.notificationLinkJa"
            @invalid="language = 'jp'"
            maxlength="65535"
          />
        </div>
      </div>
      <div class="mt-4">
        <label class="col-lg-12 fw-bold text-muted">
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
      <div class="mt-4">
        <label class="col-lg-12 fw-bold text-muted" for="start_date">
          {{ $t('startDate') }}
        </label>
        <input
          required
          type="datetime-local"
          id="start_date"
          class="form-control form-control-sm"
          :max="campaign.endDate"
          v-model="campaign.startDate"
        />
      </div>
      <div class="mt-4">
        <label class="col-lg-12 fw-bold text-muted" for="end_date">
          {{ $t('endDate') }}
        </label>
        <input
          required
          type="datetime-local"
          id="end_date"
          class="form-control form-control-sm"
          :min="campaign.startDate"
          v-model="campaign.endDate"
        />
      </div>
      <div class="mt-8">
        <p class="fw-bold text-muted mt-3 mb-0">{{ $t('type') }}</p>
        <el-radio-group v-model="campaign.type" :disabled="!!campaign.id" class="ml-4">
          <el-radio :label="CampaignType.DEFAULT" size="large">{{ $t('campaignDefault') }}</el-radio>
          <el-radio :label="CampaignType.DAILY" size="large">{{ $t('campaignDaily') }}</el-radio>
        </el-radio-group>
      </div>

      <div style="min-height: 60px">
        <div v-if="campaign.type === CampaignType.DAILY">
          <label class="col-lg-12 fw-bold text-muted"> {{ $t('resetDailyTime') }} </label>
          <input
            required
            type="time"
            class="form-control form-control-sm"
            v-model="campaign.resetTime"
            :disabled="!!campaign.id"
          />
        </div>

        <div v-if="campaign.type === CampaignType.DEFAULT" class="fv-row mb-4">
          <div class="d-flex flex-stack">
            <div class="me-5">
              <label class="fs-6 fw-bold">{{ $t('hiddenFromUser') }}</label>
            </div>
            <label class="form-check form-switch form-check-custom form-check-solid">
              <input class="form-check-input" name="status" type="checkbox" v-model="campaign.isHidden" />
              <span class="form-check-label fw-bold text-muted">
                <template v-if="campaign.isHidden"> {{ $t('yes') }} </template>
                <template v-else>{{ $t('no') }}</template>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="my-4">
        <button
          type="submit"
          class="btn btn-primary w-100"
          :data-kt-indicator="saveLoading ? 'on' : null"
          :disabled="saveLoading"
        >
          <span class="indicator-label">{{ $t('saveCampaign') }}</span>
          <span class="indicator-progress">
            {{ $t('pleaseWait') }}
            <span class="spinner-border spinner-border-sm align-middle ms-2"> </span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import { defineComponent, ref } from 'vue'
import { Campaign, CampaignType } from '../module/campaign'
import { CampaignService } from '../module/campaign/campaign.service'

export default defineComponent({
  props: {
    originCampaign: { type: Campaign, default: () => Campaign.blank() },
  },
  setup() {
    return {
      campaign: ref<Campaign>(Campaign.blank()),
      language: ref<'en' | 'jp'>('en'),

      CampaignType,

      showModal: ref(false),
      saveLoading: ref(false),
    }
  },
  watch: {
    originCampaign(newValue: Campaign) {
      this.campaign = Campaign.fromInstance(newValue)
    },
  },
  methods: {
    async saveCampaign(e: Event) {
      e.preventDefault()

      let result: any
      if (!this.campaign.id) {
        this.saveLoading = true
        result = await CampaignService.createOne(this.campaign)
      } else {
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

        if (!isConfirmed) return
        this.saveLoading = true
        result = await CampaignService.updateOne(this.campaign.id, this.campaign)
      }

      this.saveLoading = false

      if (result.data?.errors?.[0]?.property) {
        return this.$toastr.error('Please check field: ' + result.data.errors[0].property)
      }
      if (result.data.message) {
        return this.$toastr.error(this.$t(result.data.message))
      }
      this.$toastr.success('Campaign saved!')
      return this.$emit('saved', result.data)
    },
    handleCancel() {
      this.showModal = false
    },
  },
})
</script>
