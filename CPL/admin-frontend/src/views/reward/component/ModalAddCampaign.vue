<template>
  <VueModal v-model:show="showModal" style="width: 700px">
    <template #content>
      <div class="bg-white">
        <div class="d-flex justify-content-between align-items-center p-6" style="border-bottom: 1px solid #eff2f5">
          <h2 class="fw-bolder">{{ $t('createCampaign') }}</h2>
          <button @click="showModal = false" class="btn btn-icon btn-sm btn-active-icon-primary">
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </button>
        </div>
      </div>
      <CampaignSummary @saved="handleSave" />
    </template>
  </VueModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueModal from '../common/VueModal.vue'
import { Campaign } from '../module/campaign'
import CampaignSummary from './CampaignSummary.vue'

export default defineComponent({
  components: { VueModal, CampaignSummary },
  emits: ['success', 'update:showModal'],
  setup() {
    return {
      showModal: ref(false),
    }
  },
  methods: {
    async openModal() {
      this.showModal = true
    },
    async handleSave(campaign: Campaign) {
      this.$router.push({
        name: 'campaign.detail',
        params: { id: campaign.id },
      })
    },
  },
})
</script>
