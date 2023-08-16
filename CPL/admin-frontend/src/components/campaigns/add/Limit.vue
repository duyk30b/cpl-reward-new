<template>
  <div class="z-limit">
    <div class="mt-4">
      <div class="mt-2">
        <label class="col-lg-12 fw-bold text-muted" for="start_date">
          {{ $t('startDate') }}
        </label>
        <input
          required
          type="datetime-local"
          id="start_date"
          class="form-control form-control-sm"
          v-model="limitOption.startDate"
        />
      </div>
      <div class="mt-2">
        <label class="col-lg-12 fw-bold text-muted" for="start_date">
          {{ $t('endDate') }}
        </label>
        <input
          required
          type="datetime-local"
          id="end_date"
          class="form-control form-control-sm"
          :min="limitOption.startDate"
          v-model="limitOption.endDate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LimitOption from '@/core/data/campaign/limit-option'
import { capitalizeFirstLetter } from '@/core/helpers/util'

export default defineComponent({
  name: 'limit',
  data() {
    return {
      limitOption: new LimitOption(),
      currencies: ['USDT'],
    }
  },
  methods: {
    uppercaseFirst(str) {
      return capitalizeFirstLetter(str)
    },
  },
  props: {
    propLimit: {
      type: LimitOption,
      default: () => {
        return new LimitOption()
      },
    },
  },
  mounted() {
    this.limitOption = this.propLimit
  },
  watch: {
    propLimit(newVal) {
      this.limitOption = newVal
    },
    limitOption: {
      handler(newVal) {
        this.$emit('updated', newVal)
      },
      deep: true,
    },
  },
})
</script>
