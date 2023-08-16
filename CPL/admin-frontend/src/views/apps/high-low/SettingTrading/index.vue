<template>
  <div>
    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li class="nav-item">
        <a
          @click="handleChangeTab('common')"
          :class="activeTab === 'common' || activeTab === '' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_common"
          >{{ $t('highLow.common') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('setting')"
          :class="activeTab === 'setting' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_settingPair"
          >{{ $t('highLow.settingPair') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('trading')"
          :class="activeTab === 'trading' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_trading"
          >{{ $t('highLow.tradingMode') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('user-grant-payout')"
          :class="activeTab === 'user-grant-payout' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_user_grant_payout"
          >{{ $t('highLow.grantPayout') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('setting-dev')"
          :class="activeTab === 'setting-dev' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_settingPairDev"
          >DEV - {{ $t('highLow.settingPair') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('trading-dev')"
          :class="activeTab === 'trading-dev' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_tradingDev"
          >DEV - {{ $t('highLow.tradingMode') }}</a
        >
      </li>
    </ul>
    <div class="tab-content" id="tabContent">
      <div
        :class="
          activeTab === 'common' || activeTab === '' ? 'show active' : 'fade'
        "
        class="tab-pane"
        id="tab_pane_common"
        role="tabpanel"
      >
        <Common />
      </div>
      <div
        :class="activeTab === 'setting' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_settingPair"
        role="tabpanel"
      >
        <Setting />
      </div>
      <div
        :class="activeTab === 'setting-dev' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_settingPairDev"
        role="tabpanel"
      >
        <SettingDev />
      </div>
      <div
        :class="activeTab === 'trading' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_trading"
        role="tabpanel"
      >
        <Trading />
      </div>
      <div
        :class="activeTab === 'trading-dev' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_tradingDev"
        role="tabpanel"
      >
        <TradingDev />
      </div>
      <div
        :class="activeTab === 'user-grant-payout' ? 'show active' : 'fade'"
        class="tab-pane fade"
        id="tab_pane_user_grant_payout"
        role="tabpanel"
      >
        <UserGrantPayout />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { Actions } from '@/store/enums/StoreEnums'
import { defineComponent } from 'vue'

import Common from './Common.vue'
import Setting from './Setting.vue'
import SettingDev from './SettingDev.vue'
import Trading from './Trading.vue'
import TradingDev from './TradingDev.vue'
import UserGrantPayout from './UserGrantPayout.vue'

export default defineComponent({
  name: 'history',
  components: {
    Common,
    Setting,
    SettingDev,
    Trading,
    TradingDev,
    UserGrantPayout,
  },
  async mounted() {
    this.$store.dispatch(Actions.FETCH_GET_PAIRS)
    this.$store.dispatch(Actions.FETCH_GET_MODES)
    this.$store.dispatch(Actions.FETCH_GET_PERIOD)
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.settingTrading', ['highLow.highLow'])
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
        name: 'high-low-setting-trading',
        query: { tab },
      })
    },
  },
})
</script>
