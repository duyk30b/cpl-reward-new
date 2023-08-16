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
          @click="handleChangeTab('trade-mode')"
          :class="activeTab === 'trade-mode' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_trade"
          >{{ $t('highLow.tradeMode') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('market')"
          :class="activeTab === 'market' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_market"
          >{{ $t('highLow.market') }}</a
        >
      </li>
      <li class="nav-item">
        <a
          @click="handleChangeTab('block-user')"
          :class="activeTab === 'block-user' ? 'active' : ''"
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_block_user"
        >
          {{ $t('highLow.blockUser') }}</a
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
        :class="activeTab === 'trade-mode' ? 'show active' : 'fade'"
        class="tab-pane"
        id="tab_pane_common"
        role="tabpanel"
      >
        <Trade />
      </div>
      <div
        :class="activeTab === 'market' ? 'show active' : 'fade'"
        class="tab-pane"
        id="tab_pane_common"
        role="tabpanel"
      >
        <Market />
      </div>
      <div
        :class="activeTab === 'block-user' ? 'show active' : 'fade'"
        class="tab-pane"
        id="tab_pane_common"
        role="tabpanel"
      >
        <BlockUser />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Common from './Common.vue'
import Trade from './Trade.vue'
import Market from './Market.vue'
import BlockUser from './BlockUser.vue'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'suspension',
  components: {
    Common,
    Trade,
    Market,
    BlockUser,
  },
  async mounted() {
    this.$store.dispatch(Actions.FETCH_GET_PAIRS)
    this.$store.dispatch(Actions.FETCH_GET_MODES)
    this.$store.dispatch(Actions.FETCH_GET_PERIOD)
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.suspensionList', ['highLow.highLow'])
  },
  data() {
    return {}
  },
  computed: {
    activeTab(): string {
      return (this.$route.query?.tab as string) || ''
    },
  },
  methods: {
    handleChangeTab(tab) {
      this.$router.push({
        name: 'high-low-suspension',
        query: { tab },
      })
    },
  },
})
</script>
