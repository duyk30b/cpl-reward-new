<template>
  <h3 class="fw-bolder">{{ $t('missionBasicInfo') }}</h3>
  <div class="row mb-5">
    <div class="col-md-6">
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
      <div v-show="currentLanguage == 'en'">
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> Mission name </label>
          <input
            required
            type="text"
            class="form-control form-control-sm"
            name="name"
            :value="title"
            @input="$emit('update:title', $event.target.value)"
            @invalid="switchLanguage('en')"
            maxlength="255"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted">
            Short description
          </label>
          <textarea
            required
            type="text"
            class="form-control form-control-sm"
            name="description"
            :value="detailExplain"
            rows="5"
            @input="$emit('update:detailExplain', $event.target.value)"
            @invalid="switchLanguage('en')"
            maxlength="65535"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted"> Guide link </label>
          <input
            type="url"
            class="form-control form-control-sm"
            name="guideLink"
            :value="guideLink"
            @input="$emit('update:guideLink', $event.target.value)"
            @invalid="switchLanguage('en')"
            maxlength="65535"
          />
        </div>
      </div>
      <div v-show="currentLanguage === 'jp'">
        <div class="mt-4">
          <label class="col-lg-12 fw-bold text-muted"> ミッション名 </label>
          <input
            required
            type="text"
            class="form-control form-control-sm"
            name="nameJa"
            :value="titleJa"
            @input="$emit('update:titleJa', $event.target.value)"
            @invalid="switchLanguage('jp')"
            maxlength="255"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted"> 簡単な説明 </label>
          <textarea
            required
            type="text"
            class="form-control form-control-sm"
            name="detailExplainJa"
            :value="detailExplainJa"
            rows="5"
            @input="$emit('update:detailExplainJa', $event.target.value)"
            @invalid="switchLanguage('jp')"
            maxlength="65535"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted"> ガイドリンク </label>
          <input
            type="url"
            class="form-control form-control-sm"
            name="guideLinkJa"
            :value="guideLinkJa"
            @input="$emit('update:guideLinkJa', $event.target.value)"
            @invalid="switchLanguage('jp')"
            maxlength="65535"
          />
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="mt-17">
        <div>
          <label class="col-lg-12 fw-bold text-muted">
            {{ $t('startDate') }}
          </label>
          <input
            required
            type="datetime-local"
            class="form-control form-control-sm"
            :value="openingDate"
            :min="transformCampaignStartDate"
            :max="transformCampaignEndDate"
            :disabled="campaign.type === CAMPAIGN_TYPE.ORDER"
            @input="$emit('update:openingDate', $event.target.value)"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted">
            {{ $t('endDate') }}
          </label>
          <input
            required
            type="datetime-local"
            class="form-control form-control-sm"
            :value="closingDate"
            :min="openingDate"
            :max="transformCampaignEndDate"
            :disabled="campaign.type === CAMPAIGN_TYPE.ORDER"
            @input="$emit('update:closingDate', $event.target.value)"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted">
            {{ $t('priorityOrder') }}
          </label>
          <input
            required
            type="number"
            class="form-control form-control-sm"
            name="priority"
            min="0"
            max="2147483647"
            :value="priority"
            @input="$emit('update:priority', $event.target.value)"
          />
        </div>
        <div class="mt-2">
          <label class="col-lg-12 fw-bold text-muted">
            {{ $t('limitReceivedReward') }}
          </label>
          <input
            required
            type="number"
            class="form-control form-control-sm"
            name="limitReceivedReward"
            min="1"
            max="999999"
            :disabled="campaign.type === CAMPAIGN_TYPE.ORDER"
            :value="limitReceivedReward"
            @input="$emit('update:limitReceivedReward', $event.target.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Campaign, { CAMPAIGN_TYPE } from '@/core/data/campaign/campaign'
import moment from 'moment'

export default defineComponent({
  name: 'mission-basic-info',
  props: {
    openingDate: String,
    closingDate: String,
    title: String,
    detailExplain: String,
    priority: [Number, String],
    guideLink: String,
    limitReceivedReward: Number,
    titleJa: String,
    detailExplainJa: String,
    guideLinkJa: String,
    campaign: Campaign,
  },
  emits: [
    'update:openingDate',
    'update:closingDate',
    'update:title',
    'update:detailExplain',
    'update:priority',
    'update:guideLink',
    'update:limitReceivedReward',
    'update:titleJa',
    'update:detailExplainJa',
    'update:guideLinkJa',
  ],
  data() {
    return {
      currentLanguage: 'en',
      CAMPAIGN_TYPE,
    }
  },
  computed: {
    transformCampaignStartDate() {
      return this.convertUnixTimeToISO(this.campaign?.startDate)
    },
    transformCampaignEndDate() {
      return this.convertUnixTimeToISO(this.campaign?.endDate)
    },
  },
  watch: {
    campaign: {
      handler(newVal) {
        if (newVal.type === CAMPAIGN_TYPE.ORDER) {
          this.$emit(
            'update:openingDate',
            moment.unix(newVal.startDate).format('YYYY-MM-DDTHH:mm'),
          )
          this.$emit(
            'update:closingDate',
            moment.unix(newVal.endDate).format('YYYY-MM-DDTHH:mm'),
          )
        }
      },
      deep: true,
    },
  },
  methods: {
    switchLanguage(language) {
      this.currentLanguage = language
    },
    convertUnixTimeToISO(unixTime) {
      if (!unixTime) {
        return ''
      }

      return moment.unix(unixTime).format('YYYY-MM-DDTHH:mm')
    },
  },
})
</script>
