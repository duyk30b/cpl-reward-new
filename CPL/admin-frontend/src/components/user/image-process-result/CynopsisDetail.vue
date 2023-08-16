<template>
  <base-modal
    title="Cynopsis"
    :show="show"
    @close="close"
    dialogClass="modal-xl"
  >
    <template v-slot:body>
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
        role="tablist"
      >
        <li class="nav-item" v-for="tab in availableTabs" :key="tab">
          <a
            class="nav-link text-uppercase"
            :class="{ active: tab == currentTab }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseTab(tab)"
            role="tab"
          >
            {{ $t(`imageProcessDetailTab.${tab}`) }}
          </a>
        </li>
      </ul>
      <div class="tab-content py-8 border-start border-end border-bottom px-6">
        <div
          class="tab-pane"
          :class="{
            active: currentTab == ImageProcessDetailTab.COMPARE_STATUS,
          }"
        >
          <no-data></no-data>
        </div>
        <div
          class="tab-pane"
          :class="{
            active: currentTab == ImageProcessDetailTab.DUPLICATE_STATUS,
          }"
        >
          <no-data></no-data>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-secondary" type="button" @click="close">
        {{ $t('close') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  ImageProcessResult,
  KycImageProvider,
} from '@/models/user/UserKycScanData'
import { UserKyc, UserKycHistory } from '@/models/user/UserKyc'
import BaseModal from '@/components/modals/BaseModal.vue'
import { ImageProcessDetailTab } from './image-process-detail.const'
import NoData from '@/components/common/NoData.vue'

export default defineComponent({
  emits: ['close'],
  name: 'image-process-detail',
  components: { BaseModal, NoData },
  mounted() {
    this.chooseTab(this.initTab)
  },
  props: {
    result: ImageProcessResult,
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    show: Boolean,
    initTab: {
      type: String,
      default: ImageProcessDetailTab.COMPARE_STATUS,
    },
  },
  watch: {
    initTab: function () {
      this.chooseTab(this.initTab)
    },
  },
  data() {
    return {
      ImageProcessDetailTab,
      KycImageProvider,
      currentTab: ImageProcessDetailTab.COMPARE_STATUS as unknown as string,
      availableTabs: [
        ImageProcessDetailTab.COMPARE_STATUS,
        ImageProcessDetailTab.DUPLICATE_STATUS,
      ],
    }
  },
  methods: {
    chooseTab(tab: string) {
      this.currentTab = tab
    },
    close() {
      this.$emit('close')
    },
  },
})
</script>
