<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid order-2 order-lg-2 mb-10 mb-lg-0">
      <!--begin::Form-->
      <div id="kt_campaigns_create_new">
        <Mission
          v-for="(mission, i) in missions"
          :key="i"
          :mission-index="i"
          :prop-mission="mission"
          @updated="missionUpdated(i, ...arguments)"
          @deleteMission="deleteMission(i)"
          :campaign="originCampaign"
          :ref="'mission_' + i"
        ></Mission>
        <div>
          <button
            type="button"
            class="btn btn-sm btn-primary me-4"
            @click="newMission"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen041.svg" />
            </span>
            {{ $t('newMission') }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-success"
            @click="saveAllMission"
            :disabled="missions.length === 0"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen037.svg" />
            </span>
            {{ $t('saveAllMissions') }}
          </button>
        </div>
      </div>
      <!--end::Form-->
    </div>
    <!--end::Content-->

    <!--begin::Sidebar-->
    <div
      class="flex-column flex-lg-row-auto me-lg-15 w-100 w-lg-300px w-xl-350px mb-10 order-1 order-lg-1"
    >
      <CampaignSummary
        :prop-campaign="campaign"
        @update="campaignUpdated"
        @saved="campaignSaved"
        :missions="missions"
      >
      </CampaignSummary>
    </div>
    <!--end::Sidebar-->
  </div>
  <div v-if="loading" class="overlay-loader" v-loading="true"></div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Mission from '@/components/campaigns/add/Mission.vue'
import CampaignSummary from '@/components/campaigns/add/CampaignSummary.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import MissionEntity from '@/core/data/campaign/mission'
import Campaign, { CAMPAIGN_TYPE } from '@/core/data/campaign/campaign'
import ApiService from '@/core/services/ApiService'
import { plainToInstance } from 'class-transformer'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import Swal from 'sweetalert2'
import { DisplayConditionEntity } from '@/core/data/campaign/display-condition'
import moment from 'moment'
import * as _ from 'lodash'

export default defineComponent({
  name: 'campaign.detail',
  components: {
    CampaignSummary,
    Mission,
  },
  data() {
    return {
      campaign: new Campaign(),
      originCampaign: new Campaign(),
      missions: [] as MissionEntity[],
      loading: false,
    }
  },
  methods: {
    async getCampaign() {
      const response = await ApiService.get(
        '/campaign/' + this.$route.params.id,
      ).catch((e) => {
        console.log(e)
      })

      if (response && response.data) {
        this.campaign = plainToInstance(Campaign, response.data)
        this.originCampaign = plainToInstance(Campaign, response.data)
      }
    },
    async getMissions() {
      const response = await ApiService.get(
        '/mission?campaign_id=' + this.$route.params.id,
      ).catch((e) => {
        console.log(e)
      })

      if (response && response.data) {
        this.missions = (response.data.missions || []).map((mission) => {
          const transformedMission = plainToInstance(MissionEntity, mission)
          if (!transformedMission.displayConditions) {
            transformedMission.displayConditions = [
              new DisplayConditionEntity(),
            ]
          }

          return transformedMission
        })

        this.sortMissionsByPriority()
      }
    },
    campaignUpdated(newVal) {
      this.campaign = newVal
    },
    campaignSaved(newVal) {
      this.campaign = newVal
      this.originCampaign = { ...newVal }
    },
    missionUpdated(i, newVal) {
      this.missions[i] = newVal
      if (!newVal.isModified) {
        this.sortMissionsByPriority()
      }
      this.$forceUpdate()
    },
    newMission() {
      const mission = new MissionEntity()

      if (this.originCampaign.type === CAMPAIGN_TYPE.ORDER) {
        mission.openingDate = moment
          .unix(this.originCampaign.startDate)
          .format('YYYY-MM-DDTHH:mm')
        mission.closingDate = moment
          .unix(this.originCampaign.endDate)
          .format('YYYY-MM-DDTHH:mm')
        // mission.displayConditions = []
      }
      mission.displayConditions = [new DisplayConditionEntity()]
      mission.campaignId = parseInt('' + this.$route.params.id)
      mission.isModified = true
      this.missions = [...this.missions, mission]
    },
    deleteMission(i) {
      if (this.missions.length > 1) {
        this.missions.splice(i, 1)
      }
    },
    async saveAllMission() {
      let isValid = true

      this.missions.forEach((e, index) => {
        const missionElement = this.$refs[`mission_${index}`] as InstanceType<
          typeof Mission
        >
        isValid = isValid && missionElement[0].validateForm()
      })

      if (!isValid) {
        return
      }

      const priority = this.missions.map((m) => m.priority)
      const priorityGroups = _.groupBy(priority)
      if (
        Object.values(priorityGroups).some(
          (priorityGroup) => priorityGroup.length > 1,
        )
      ) {
        this.$toastr.error(this.$t('MISSION.DUPLICATE_PRIORITY'))
        return
      }

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

      const excuteSubmit = this.missions.map((e, index) => {
        const missionElement = this.$refs[`mission_${index}`] as InstanceType<
          typeof Mission
        >
        return missionElement[0].saveMission()
      })

      this.loading = true
      await Promise.allSettled(excuteSubmit)
      this.loading = false
    },
    isUnsafeToLeave() {
      return this.missions.reduce(
        (prev, current) => prev || current.isModified,
        false,
      )
    },
    sortMissionsByPriority() {
      if (this.campaign.type === CAMPAIGN_TYPE.ORDER) {
        this.missions.sort((prev, next) => prev.id - next.id)
        this.missions.sort((prev, next) => next.priority - prev.priority)
      }
    },
  },
  async mounted() {
    await this.getCampaign()
    await this.getMissions()
  },
  created() {
    window.onbeforeunload = (e) => {
      if (this.isUnsafeToLeave()) {
        const message = this.$t('unsafeToLeave')
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }
  },
  unmounted() {
    window.onbeforeunload = () => undefined
  },
  beforeRouteLeave() {
    if (!this.isUnsafeToLeave()) {
      return true
    }

    const message = this.$t('unsafeToLeave')
    const answer = window.confirm(message)
    if (!answer) {
      return false
    }
  },
  setup() {
    const store = useStore()

    store.dispatch(Actions.FETCH_KAFKA_EVENTS_ACTION)
    store.dispatch(Actions.FETCH_GRANT_TARGET_ACTION)
    store.dispatch(Actions.FETCH_USER_CONDITION_ACTION)
    store.dispatch(Actions.FETCH_DISPLAY_CONDITION_ACTION)
    store.dispatch(Actions.FETCH_LIST_COIN)

    onMounted(() => {
      setCurrentPageBreadcrumbs('campaignDetail', ['menu.marketingFunctions'])
    })

    return {}
  },
})
</script>

<style lang="scss">
.overlay-loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}
</style>
