<template>
  <div>
    <div v-if="type === 'view'">
      <Detail />
    </div>
    <div v-if="type === 'view-dev'">
      <DetailDev />
    </div>
    <div v-if="type === 'edit-dev'">
      <UpdateDev />
    </div>
    <div v-if="type === 'edit'">
      <Update />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import Detail from './Detail.vue'
import Update from './Update.vue'
import DetailDev from './DetailDev.vue'
import UpdateDev from './UpdateDev.vue'

export default defineComponent({
  name: 'settingTradingPageDetail',
  components: {
    Detail,
    Update,
    DetailDev,
    UpdateDev,
  },
  data() {
    return {
      type: 'view-dev',
    }
  },
  watch: {
    '$route.query.type': {
      handler: function (type) {
        this.type = type
      },
    },
  },
  mounted() {
    this.type = this.$route.query.type?.toString() || 'view'
  },
})
</script>
