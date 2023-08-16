<template>
  <div>
    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li class="nav-item">
        <a
          @click="handleChangeTab('crypto')"
          :class="activeTab === 'crypto' || activeTab === '' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_crypto"
          >{{ $t('highLow.crypto') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('forex')"
          :class="activeTab === 'forex' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_forex"
          >{{ $t('highLow.forex') }}</a
        >
      </li>
    </ul>
    <div class="tab-content" id="tabContent">
      <div
        :class="
          activeTab === 'crypto' || activeTab === '' ? 'show active' : 'fade'
        "
        class="tab-pane"
        id="tab_pane_crypto"
        role="tabpanel"
      >
        <CryptoSetting />
      </div>
      <div
        :class="activeTab === 'forex' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_forex"
        role="tabpanel"
      >
        <ForexSetting />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import CryptoSetting from './CryptoSetting.vue'
import ForexSetting from './ForexSetting.vue'

export default defineComponent({
  name: 'setting_crawler',
  components: {
    CryptoSetting,
    ForexSetting,
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.crawler', ['highLow.highLow'])
  },
  computed: {
    activeTab(): string {
      return (this.$route.query?.tab as string) || ''
    },
  },
  data() {
    return {}
  },
  methods: {
    handleChangeTab(tab) {
      this.$router.push({
        name: 'high-low-setting-crawler',
        query: { tab },
      })
    },
  },
})
</script>
