<template>
  <div
    class="d-flex align-items-center justify-content-center text-primary py-6"
    v-if="loadingCynopsis"
  >
    <div class="spinner-border me-2">
      <span class="visually-hidden"></span>
    </div>
    {{ $t('loading') }}
  </div>
  <template v-else>
    <div class="section-block">
      <button
        class="btn btn-primary text-uppercase"
        @click="renewCynopsisData"
        :disabled="
          !cynopsis ||
          !cynopsis.recordId ||
          !cynopsis.customerId ||
          renewingCynopsisData
        "
      >
        <i
          class="fas me-1 fa-fw"
          :class="{
            'fa-spinner fa-spin': renewingCynopsisData,
            'fa-redo': !renewingCynopsisData,
          }"
        ></i>
        {{ $t('rescreenThisProfile') }}
      </button>
    </div>
    <div class="section-block">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
        role="tablist"
      >
        <li class="nav-item">
          <a
            class="nav-link active text-uppercase"
            data-bs-toggle="tab"
            href="#dj-tab"
            role="tab"
          >
            {{ $t('dowJonesFeed') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-uppercase"
            data-bs-toggle="tab"
            href="#internet-search-tab"
            role="tab"
          >
            {{ $t('internetSearch') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-uppercase"
            data-bs-toggle="tab"
            href="#artemiscan-tab"
            role="tab"
          >
            {{ $t('artemiscan') }}
          </a>
        </li>
      </ul>
      <div class="tab-content pt-8">
        <div class="tab-pane active" id="dj-tab">
          <dow-jones-feed
            :results="cynopsis?.cynopsisData?.DJ"
            :userInfo="userInfo"
          >
          </dow-jones-feed>
        </div>

        <div class="tab-pane" id="internet-search-tab">
          <internet-search
            :results="cynopsis?.cynopsisData?.internetSearch"
          ></internet-search>
        </div>

        <div class="tab-pane" id="artemiscan-tab">
          <artemiscan
            :results="cynopsis?.cynopsisData?.ArtemiScan"
          ></artemiscan>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserKycCynopsis } from '@/models/user/UserKycScanData'
import DowJonesFeed from './dow-jones-feed/DowJonesFeed.vue'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import InternetSearch from './internet-search/InternetSearch.vue'
import Artemiscan from '../screening-screen/Artemiscan.vue'
import { UserKycService } from '@/services/UserKycService'

export default defineComponent({
  components: { DowJonesFeed, InternetSearch, Artemiscan },
  emits: ['renewCynopsisData'],
  name: 'screening-screen',
  props: {
    userInfo: {
      type: Object as PropType<UserInfo | UserInfoHistory>,
    },
    cynopsis: {
      type: UserKycCynopsis,
    },
    loadingCynopsis: {
      type: Boolean,
    },
  },
  data() {
    return {
      renewingCynopsisData: false,
    }
  },
  methods: {
    async renewCynopsisData() {
      if (!this.cynopsis?.historyId) return
      this.renewingCynopsisData = true
      const res = await UserKycService.rennewCynopsisData(
        this.cynopsis.historyId,
      )
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$emit('renewCynopsisData')
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
      }
      this.renewingCynopsisData = false
    },
  },
})
</script>
