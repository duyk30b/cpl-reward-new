<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 2C5 1.44772 5.44772 1 6 1H14C14.5523 1 15 1.44772 15 2C15 2.55228 14.5523 3 14 3H6C5.44772 3 5 2.55228 5 2Z"
      :fill="color"
    />
    <path
      d="M5 6C5 5.44772 5.44772 5 6 5H14C14.5523 5 15 5.44772 15 6C15 6.55228 14.5523 7 14 7H6C5.44772 7 5 6.55228 5 6Z"
      :fill="color"
    />
    <path
      d="M1 10C1 9.44771 1.44772 9 2 9H14C14.5523 9 15 9.44771 15 10C15 10.5523 14.5523 11 14 11H2C1.44772 11 1 10.5523 1 10Z"
      :fill="color"
    />
    <path
      d="M2 13C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14C15 13.4477 14.5523 13 14 13H2Z"
      :fill="color"
    />
    <path
      d="M2 1C1.44772 1 1 1.44772 1 2V6C1 6.55228 1.44772 7 2 7C2.55228 7 3 6.55228 3 6V2C3 1.44772 2.55228 1 2 1Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  name: 'sell-order-list-icon',
  props: {
    width: {
      type: String,
      default: '18',
    },
    height: {
      type: String,
      default: '18',
    },
    color: {
      type: String,
      default: '#e63332',
    },
  },
})
</script>
