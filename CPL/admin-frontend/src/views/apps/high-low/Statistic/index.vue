<template>
  <div>
    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li class="nav-item">
        <a
          class="nav-link active"
          data-bs-toggle="tab"
          href="#tab_pane_summary"
          >{{ $t('highLow.summary') }}</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab_pane_detail">{{
          $t('highLow.detail')
        }}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab_pane_user">{{
          $t('userLabel')
        }}</a>
      </li>
    </ul>

    <div class="tab-content" id="tabContent">
      <div
        class="tab-pane fade show active"
        id="tab_pane_summary"
        role="tabpanel"
      >
        <Summary />
      </div>
      <div class="tab-pane fade" id="tab_pane_detail" role="tabpanel">
        <Detail />
      </div>
      <div class="tab-pane fade" id="tab_pane_user" role="tabpanel">
        <User />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Summary from './Summary.vue'
import Detail from './Detail.vue'
import User from './User.vue'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'statistic',
  components: {
    Summary,
    Detail,
    User,
  },
  async mounted() {
    this.$store.dispatch(Actions.FETCH_GET_PAIRS)
    this.$store.dispatch(Actions.FETCH_GET_MODES)
    this.$store.dispatch(Actions.FETCH_GET_PERIOD)
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.statistic', ['highLow.highLow'])
  },
  data() {
    return {}
  },
})
</script>
