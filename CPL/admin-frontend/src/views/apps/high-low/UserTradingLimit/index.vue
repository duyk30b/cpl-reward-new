<template>
  <div><Trading /></div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Trading from './Trading.vue'

export default defineComponent({
  name: 'userTradingLimiy',
  components: {
    Trading,
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.userTradingLimit', ['highLow.highLow'])
  },
  data() {
    return {}
  },
})
</script>
