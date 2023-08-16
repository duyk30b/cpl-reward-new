<template>
  <new-currency :isERCBEP20="false" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewCurrency from '@/views/currency/components/NewCurrency.vue'

export default defineComponent({
  name: 'RegisterNewCurrency',
  components: {
    NewCurrency,
  },
})
</script>
