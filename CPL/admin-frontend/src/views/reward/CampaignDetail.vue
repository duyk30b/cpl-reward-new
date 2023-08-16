<template>
  <div class="d-flex" style="gap: 40px">
    <div style="flex-basis: 400px; flex-shrink: 0">
      <CampaignSummary :originCampaign="campaign" />

      <div class="mt-8 d-none d-lg-block list-mission-index">
        <el-timeline class="list-mission-timeline">
          <el-timeline-item
            v-for="(mission, index) in missions"
            :key="index"
            type="primary"
            :color="missionsModify[index] ? '#ffc700' : ''"
          >
            <a href="" @click="scrollToMission($event, index)" :class="{ 'link-warning': missionsModify[index] }">
              {{ campaign.type === CampaignType.DAILY ? `Day ${index + 1} - ` : '' }}
              {{ mission.id ? `ID: ${mission.id} - ${mission.title}` : mission.title || $t('untitled') }}
            </a>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div style="flex: 1">
      {{ JSON.stringify({missionsModify}) }}
      <template v-for="(mission, index) in missions" :key="mission.id">
        <MissionSummary
          ref="missionsElement"
          :originCampaign="campaign"
          :originMission="mission"
          :index="index"
          @modify="(v) => (missionsModify[index] = v)"
        />
      </template>
      <div>
        <button type="button" class="btn btn-sm btn-primary me-4" @click="createNewMission">
          <span class="svg-icon svg-icon-3">
            <inline-svg src="media/icons/duotune/general/gen041.svg" />
          </span>
          {{ $t('newMission') }}
        </button>
        <button type="button" class="btn btn-sm btn-success" @click="saveAllMission" :disabled="missions.length === 0">
          <span class="svg-icon svg-icon-3">
            <inline-svg src="media/icons/duotune/general/gen037.svg" />
          </span>
          {{ $t('saveAllMissions') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import { defineComponent, ref } from 'vue'
import CampaignSummary from './component/CampaignSummary.vue'
import MissionSummary from './component/MissionSummary.vue'
import { Campaign, CampaignService, CampaignType } from './module/campaign'
import { Mission, MissionService } from './module/mission'
import { CoinStore } from './store/coin.store'
import { ConditionRulesStore } from './store/mission-condition.store'
import { GrantTargetStore } from './store/mission-grant-target.store'

export default defineComponent({
  name: 'campaign.detail',
  components: {
    CampaignSummary,
    MissionSummary,
  },
  setup() {
    return {
      campaign: ref<Campaign>(Campaign.blank()),
      missions: ref<Mission[]>([]),
      missionModifyIndex: ref<number[]>([]),
      CampaignType,
      missionsModify: ref<Record<number, boolean>>({}),
    }
  },
  async beforeMount() {
    store.dispatch(Actions.SET_BREADCRUMB_ACTION, {
      title: this.$t('campaignDetail'),
      pageBreadcrumbPath: ['menu.marketingFunctions'],
    })
    const campaignId = this.$route.params.id as unknown as number

    this.campaign = await CampaignService.getOne(campaignId)
    this.missions = await MissionService.getMany(campaignId)

    await Promise.all([ConditionRulesStore.init(), GrantTargetStore.init(), CoinStore.init()])
  },

  methods: {
    createNewMission() {
      console.log('')
    },
    saveAllMission() {
      console.log('')
    },
    checkMissionModified(index: number) {
      const components = this.$refs.missionsElement as InstanceType<typeof MissionSummary>[]
      console.log(
        '🚀 ~ file: CampaignDetail.vue:98 ~ checkMissionModified ~ components[index].isModified:',
        components[index].isModified,
      )
      return components[index].isModified
    },
    scrollToMission(e: Event, index: number) {
      e.preventDefault()
      const components = this.$refs.missionsElement as InstanceType<typeof MissionSummary>[]
      console.log('--------------', components[index].isModified)
      const element = components[index].$el as HTMLElement
      if (element) {
        window.scrollTo({
          left: 0,
          top: element.offsetTop,
          behavior: 'smooth',
        })
      }
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
