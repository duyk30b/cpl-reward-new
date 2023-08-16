<template>
  <div><Unlimited /></div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Unlimited from './Unlimited.vue'

export default defineComponent({
  name: 'unlimitedUser',
  components: {
    Unlimited,
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.unlimitedUser', ['highLow.highLow'])
  },
  data() {
    return {}
  },
})
</script>
