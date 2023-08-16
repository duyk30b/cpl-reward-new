<template>
  <new-currency :isERCBEP20="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewCurrency from '@/views/currency/components/NewCurrency.vue'

export default defineComponent({
  name: 'RegisterNewEB20',
  components: {
    NewCurrency,
  },
})
</script>
