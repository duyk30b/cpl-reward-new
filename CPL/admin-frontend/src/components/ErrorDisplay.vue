<template>
  <span class="error" v-if="message">{{ $t(message) }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'error-display',
  props: {
    message: String,
  },
})
</script>

<style lang="scss" scoped>
span.error {
  margin-top: 5px;
  color: red;
  font-size: 0.8em;
}
</style>
