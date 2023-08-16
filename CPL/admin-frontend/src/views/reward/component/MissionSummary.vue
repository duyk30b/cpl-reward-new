<template>
  <div>
    <hr />
    {{ JSON.stringify(originMission) }}
    <hr />
    {{ JSON.stringify(mission) }}
  </div>
  <div class="card card-flush mb-5 mb-lg-10 accordion">
    <div class="d-block m-0 p-0">
      <div class="accordion-header">
        <button
          class="accordion-button fs-4 fw-bold px-10 bg-white"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#kt_mission_body_' + index"
          aria-expanded="true"
          :aria-controls="'kt_mission_body_' + index"
        >
          {{ originCampaign?.type === CampaignType.DAILY ? `Day ${index + 1} - ` : '' }}
          {{ mission.id ? `ID: ${mission.id} - ${mission.title}` : mission.title || $t('untitled') }}
          <div
            class="badge mx-4"
            v-if="mission.id"
            :class="{
              'badge-primary': Date.now() <= new Date(originMission.openingDate).getTime(),
              'badge-success':
                new Date(originMission.openingDate).getTime() < Date.now() &&
                Date.now() < new Date(originMission.closingDate).getTime(),
              'badge-warning': mission.status === 2,
              'badge-danger': new Date(originMission.closingDate).getTime() <= Date.now(),
            }"
          >
            {{ $t(`missionStatus.${mission.status}`) }}
          </div>
        </button>
      </div>
    </div>

    <div
      class="card-body accordion-collapse collapse show"
      :id="'kt_mission_body_' + index"
      :aria-labelledby="'kt_mission_header_' + index"
      :data-bs-parent="'#kt_mission_' + index"
    >
      <form ref="missionForm" @submit="confirmSaveMission">
        <div :class="{ 'overlay overlay-block': !mission.isActive }">
          <div v-if="!mission.isActive" class="overlay-layer bg-dark bg-opacity-5"></div>

          <!--Begin::Mission information-->
          <div>
            <h3 class="fw-bolder">{{ $t('missionBasicInfo') }}</h3>
            <div class="row mb-5">
              <div class="col-md-6">
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
                <div v-show="language == 'en'">
                  <div class="mt-4">
                    <label class="col-lg-12 fw-bold text-muted"> Mission name </label>
                    <input
                      required
                      class="form-control form-control-sm"
                      name="name"
                      v-model="mission.title"
                      @invalid="language = 'en'"
                      maxlength="255"
                    />
                  </div>
                  <div class="mt-2">
                    <label class="col-lg-12 fw-bold text-muted"> Short description </label>
                    <textarea
                      required
                      type="text"
                      class="form-control form-control-sm"
                      name="description"
                      v-model="mission.detailExplain"
                      rows="5"
                      @invalid="language = 'en'"
                      maxlength="65535"
                    ></textarea>
                  </div>
                  <div class="mt-2">
                    <label class="col-lg-12 fw-bold text-muted"> Guide link </label>
                    <input
                      type="url"
                      class="form-control form-control-sm"
                      name="guideLink"
                      v-model="mission.guideLink"
                      @invalid="language = 'en'"
                      maxlength="65535"
                    />
                  </div>
                </div>
                <div v-show="language == 'jp'">
                  <div class="mt-4">
                    <label class="col-lg-12 fw-bold text-muted"> ミッション名 </label>
                    <input
                      required
                      class="form-control form-control-sm"
                      name="nameJa"
                      v-model="mission.titleJa"
                      @invalid="language = 'jp'"
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
                      v-model="mission.detailExplainJa"
                      rows="5"
                      @invalid="language = 'jp'"
                      maxlength="65535"
                    ></textarea>
                  </div>
                  <div class="mt-2">
                    <label class="col-lg-12 fw-bold text-muted"> ガイドリンク </label>
                    <input
                      type="url"
                      class="form-control form-control-sm"
                      name="guideLinkJa"
                      v-model="mission.guideLinkJa"
                      @invalid="language = 'jp'"
                      maxlength="65535"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mt-17">
                  <label class="col-lg-12 fw-bold text-muted">
                    {{ $t('startDate') }}
                  </label>
                  <input
                    required
                    type="datetime-local"
                    class="form-control form-control-sm"
                    v-model="mission.openingDate"
                    :min="originCampaign.startDate"
                    :max="mission.closingDate"
                    :disabled="originCampaign.type === CampaignType.DAILY"
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
                    v-model="mission.closingDate"
                    :min="mission.openingDate"
                    :max="originCampaign.endDate"
                    :disabled="originCampaign.type === CampaignType.DAILY"
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
                    v-model="mission.priority"
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
                    :disabled="originCampaign.type === CampaignType.DAILY"
                    v-model="mission.limitReceivedReward"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--End::Mission information-->

          <!--Begin::Conditions-->
          <div class="mt-10">
            <h3 class="fw-bolder">{{ $t('eventCondition') }}</h3>
            <div class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3">
              <div class="form-group row mb-2">
                <label for="eventSelect" class="col-sm-2 col-form-label">{{ $t('event') }}</label>
                <div class="col-sm-10">
                  <select required class="form-control form-control-sm" id="eventSelect" v-model="mission.eventName">
                    <option value="" disabled>--{{ $t('selectEvent') }}--</option>
                    <option v-for="(event, key, index) in ConditionRulesStore.JudgmentRules" :key="index" :value="key">
                      {{ key }} ({{ Object.keys(event).length }} properties)
                    </option>
                  </select>
                </div>
              </div>
              <MissionCondition
                v-model:propConditions="mission.judgmentConditions"
                :DATA="ConditionRulesStore.JudgmentRules[mission.eventName!]"
              />
            </div>
          </div>

          {{ JSON.stringify(originMission.displayConditions) }}
          <hr />
          {{ JSON.stringify(mission.displayConditions) }}

          <div class="mt-10">
            <h3 class="fw-bolder">{{ $t('displayCondition') }}</h3>
            <div class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3">
              <MissionCondition
                v-model:propConditions="mission.displayConditions"
                :DATA="ConditionRulesStore.DisplayRules"
              />
            </div>
          </div>

          <div class="mt-10">
            <h3 class="fw-bolder">{{ $t('userCondition') }}</h3>
            <div class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3">
              <MissionCondition v-model:propConditions="mission.userConditions" :DATA="ConditionRulesStore.UserRules" />
            </div>
          </div>
          <!--End::Conditions-->

          <div class="z-user-conditions mt-10">
            <h3 class="fw-bolder">{{ $t('rewardRecipient') }}</h3>
            <div class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3">
              <MissionBudget
                v-model:originGrantTarget="mission.grantTarget"
                v-model:originRewardRules="mission.rewardRules"
                :missionId="mission.id"
                :DATA="GrantTargetStore.TargetRules"
                :hasMethodPercent="mission.eventName?.toLowerCase().includes('high_low') && originCampaign.isHidden"
              />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-8">
          <button
            v-if="!mission.id"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-danger"
            @click="deleteMission()"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen027.svg" />
            </span>
            {{ $t('deleteMission') }}
          </button>

          <button
            v-if="mission.id && mission.isActive"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-warning"
            @click="toggleActiveMission()"
            :data-kt-indicator="loadingActive ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen040.svg" />
            </span>
            {{ $t('deactivateMission') }}
            <span class="indicator-progress">
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>

          <button
            v-if="mission.id && !mission.isActive"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-primary"
            @click="toggleActiveMission()"
            :data-kt-indicator="loadingActive ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen043.svg" />
            </span>
            {{ $t('activateMission') }}
            <span class="indicator-progress">
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>

          <button
            v-if="mission.isActive"
            type="submit"
            class="btn btn-sm btn-flex btn-success"
            :data-kt-indicator="loadingSave ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen037.svg" />
            </span>
            {{ $t('saveMission') }}
            <span class="indicator-progress">
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Campaign, CampaignType } from '../module/campaign'
import { Mission } from '../module/mission'
import { ConditionRulesStore } from '../store/mission-condition.store'
import { GrantTargetStore } from '../store/mission-grant-target.store'
import MissionBudget from './MissionBudget.vue'
import MissionCondition from './MissionCondition.vue'

export default defineComponent({
  components: { MissionCondition, MissionBudget },
  emits: ['modify'],
  props: {
    originMission: { type: Mission, default: () => Mission.blank() },
    originCampaign: { type: Campaign, default: () => Campaign.blank() },
    index: { type: Number, default: () => 0 },
  },
  data() {
    return {
      ConditionRulesStore,
      GrantTargetStore,

      mission: Mission.blank(),

      language: 'en' as 'en' | 'jp',

      loadingSave: false,
      loadingActive: false,

      CampaignType,

      isModified: true,

      originMissionPlain: '',
    }
  },

  watch: {
    originMission: {
      handler: function (newValue) {
        this.mission = Mission.fromInstance(newValue)
        this.originMissionPlain = JSON.stringify(Mission.toPlain(newValue))
      },
      deep: true,
      immediate: true,
    },
    mission: {
      handler: function (newValue) {
        const missionPlain = JSON.stringify(Mission.toPlain(newValue))
        const modified = missionPlain != this.originMissionPlain
        // console.log('--------------------------------')
        // console.log('🚀 ~ file: MissionSummary.vue:387 ~  this.originMissionPlain:', this.originMissionPlain)
        // console.log('🚀 ~ file: MissionSummary.vue:387 ~ missionPlain:', missionPlain)
        // console.log('🚀 ~ file: MissionSummary.vue:382 ~ modified:', modified)
        // console.log('--------------------------------')
        this.$emit('modify', modified)
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    deleteMission() {
      console.log('------------')
    },

    toggleActiveMission() {
      console.log('------------')
    },

    confirmSaveMission(e: Event) {
      e.preventDefault()
      console.log('------------')
    },
  },
})
</script>

<style lang="scss" scoped>
.modified-border {
  border: 1px solid #ffc700;
  overflow: hidden;
}

.card {
  overflow: hidden;
}

.overlay-block {
  cursor: not-allowed !important;
}

.overlay-layer {
  margin: -13px;
  border-radius: 0.475rem;
}
</style>
