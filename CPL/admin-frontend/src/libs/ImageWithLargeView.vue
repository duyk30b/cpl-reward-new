<template>
  <el-image
    :class="imgClass"
    :src="src"
    :preview-src-list="previewSrcList"
    :initial-index="initialPreviewIndex"
    :fit="fit"
    :lazy="lazy"
  >
    <template #placeholder>
      <div class="image-slot">
        <i class="fas fa-spinner fa-spin fa-fw"></i>
      </div>
    </template>
    <template #error>
      <div class="image-slot">
        {{ $t('error') }}
      </div>
    </template>
  </el-image>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'img-with-large-view',
  props: {
    src: {
      type: String,
    },
    fit: {
      default: 'fill',
    },
    lazy: {
      default: false,
    },
    srcList: {
      default: [] as string[],
    },
    imgClass: {
      default: '',
    },
  },
  computed: {
    previewSrcList() {
      return this.srcList?.length ? this.srcList : [this.src]
    },
    initialPreviewIndex() {
      const index = this.previewSrcList.findIndex((url) => this.src == url)
      return index != -1 ? index : 0
    },
  },
})
</script>

<style lang="scss" scoped>
.image-slot {
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #a8abb2;
  font-size: 30px;
  padding: 30px;

  i {
    font-size: 1.2em;
  }
}
</style>
