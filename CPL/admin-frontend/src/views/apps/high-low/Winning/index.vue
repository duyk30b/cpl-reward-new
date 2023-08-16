<template>
  <div>
    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li class="nav-item">
        <a
          class="nav-link active"
          data-bs-toggle="tab"
          href="#tab_pane_seconds"
          >{{ $t('highLow.seconds') }}</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab_pane_minutes">{{
          $t('highLow.minutes')
        }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab_pane_hours">{{
          $t('highLow.hours')
        }}</a>
      </li>
    </ul>

    <div class="tab-content" id="tabContent">
      <div
        class="tab-pane fade show active"
        id="tab_pane_seconds"
        role="tabpanel"
      >
        <Seconds />
      </div>
      <div class="tab-pane fade" id="tab_pane_minutes" role="tabpanel">
        <Minutes />
      </div>
      <div class="tab-pane fade" id="tab_pane_hours" role="tabpanel">
        <Hours />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Seconds from './Seconds.vue'
import Minutes from './Minutes.vue'
import Hours from './Hours.vue'
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'winningRateAnalysis',
  components: {
    Seconds,
    Minutes,
    Hours,
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.winning', ['highLow.highLow'])
    this.$store.dispatch(Actions.FETCH_GET_PAIRS)
    this.$store.dispatch(Actions.FETCH_GET_MODES)
    this.$store.dispatch(Actions.FETCH_GET_PERIOD)
  },
  data() {
    return {}
  },
})
</script>
