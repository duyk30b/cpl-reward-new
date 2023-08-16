<template>
  <div class="d-flex justify-content-center mb-3">
    <div class="position-relative">
      <div
        v-for="(box, index) in validBoundingBoxs"
        :key="index"
        :style="{
          top: `${box.Top * 100}%`,
          left: `${box.Left * 100}%`,
          width: `${box.Width * 100}%`,
          height: `${box.Height * 100}%`,
          borderColor: box.color || '#009EF7',
        }"
        class="bounding-box"
      ></div>
      <img class="img-auto-height" :src="src" />
    </div>
  </div>
</template>

<script lang="ts">
import { BoundingBox } from '@/models/common/AmazonRekognition'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'img-with-bounding-box',
  props: {
    src: {
      type: String,
      required: true,
    },
    boundingBoxs: {
      type: Array as PropType<BoundingBox[]>,
    },
  },
  computed: {
    validBoundingBoxs() {
      return (this.boundingBoxs || []).filter((box) => box)
    },
  },
})
</script>

<style lang="scss" scoped>
.bounding-box {
  border-width: 2px;
  border-style: solid;
  position: absolute;
  z-index: 1;
  pointer-events: none;
}
</style>
