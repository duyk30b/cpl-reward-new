<template>
  <transition name="modal" mode="out-in">
    <div
      class="modal fade show d-block base-modal"
      tabindex="-1"
      aria-hidden="true"
      v-if="show"
    >
      <div class="modal-dialog" :class="dialogClass" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ $t(title) }}</h2>
            <button
              type="button"
              class="btn btn-sm btn-icon btn-active-color-primary close-modal"
              @click="close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body scroll-y">
            <slot name="body">Content</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="close"></div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'base-modal',
  props: {
    show: Boolean,
    title: String,
    dialogClass: String,
  },
  methods: {
    close: function () {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scope>
.base-modal {
  overflow-x: hidden;
  overflow-y: auto;
  .modal-dialog {
    z-index: 1052;
  }
  .modal-backdrop {
    width: unset;
    height: unset;
    right: 0;
    bottom: 0;
    z-index: 1051;
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;

  .close-modal {
    display: none;
  }
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  -ms-transform: scale(1.2) !important;
  -webkit-transform: scale(1.2) !important;
  transform: scale(1.2) !important;
}
</style>
