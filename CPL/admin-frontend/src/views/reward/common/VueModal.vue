<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-show="show" class="modal-mask" @mousedown.self="closeModal">
        <div class="modal-container" :style="style">
          <slot name="content">
            <div style="padding: 20px; background-color: #fff">
              <div>Modal Header</div>
              <div><button @click="closeModal">Close</button></div>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import type { PropType, StyleValue } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:show'],
  props: {
    show: { type: Boolean, default: () => false },
    style: {
      type: [String, Object] as PropType<StyleValue>,
      default: () => ({ width: '800px' }),
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false)
    },
  },
})
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  max-width: 90%;
  max-height: 90%;
  width: 800px;
  margin: auto;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow-y: auto;
}

.modal-container::-webkit-scrollbar-thumb {
  border: 4px solid transparent;
  border-radius: 10px;
  background-clip: padding-box;
}

.modal-container::-webkit-scrollbar {
  width: 16px;
  background-color: #fff;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
