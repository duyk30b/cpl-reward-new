<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 14C5 14.5523 5.44772 15 6 15H14C14.5523 15 15 14.5523 15 14C15 13.4477 14.5523 13 14 13H6C5.44772 13 5 13.4477 5 14Z"
      :fill="color"
    />
    <path
      d="M5 10C5 10.5523 5.44772 11 6 11H14C14.5523 11 15 10.5523 15 10C15 9.44772 14.5523 9 14 9H6C5.44772 9 5 9.44772 5 10Z"
      :fill="color"
    />
    <path
      d="M1 6C1 6.55229 1.44772 7 2 7H14C14.5523 7 15 6.55229 15 6C15 5.44771 14.5523 5 14 5H2C1.44772 5 1 5.44771 1 6Z"
      :fill="color"
    />
    <path
      d="M2 3C1.44772 3 1 2.55229 1 2C1 1.44771 1.44772 1 2 1H14C14.5523 1 15 1.44771 15 2C15 2.55229 14.5523 3 14 3H2Z"
      :fill="color"
    />
    <path
      d="M2 15C1.44772 15 1 14.5523 1 14V10C1 9.44772 1.44772 9 2 9C2.55228 9 3 9.44772 3 10V14C3 14.5523 2.55228 15 2 15Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  name: 'buy-order-list-icon',
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
      default: '#11a111',
    },
  },
})
</script>
