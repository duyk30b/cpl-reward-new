<template>
  <div class="text-center py-20 text-secondary fs-5">
    <div class="mb-3">
      <i class="fas fa-exclamation-circle fa-3x"></i>
    </div>
    {{ $t('noData') }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'no-data',
})
</script>
