<template>
  <BaseModal :title="title" :show="show" @close="close">
    <template v-slot:body>
      <p>{{ $t(confirmMessage) }}</p>
    </template>
    <template v-slot:footer>
      <button class="btn btn-secondary" @click="close">
        {{ $t('cancel') }}
      </button>
      <button
        class="btn btn-danger"
        @click="execDelete"
        :data-kt-indicator="loading ? 'on' : ''"
        :disabled="loading"
      >
        {{ $t('delete') }}
      </button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'confirm-delete-modal',
  components: { BaseModal },
  props: {
    show: Boolean,
    title: String,
    confirmMessage: String,
    deleteFunc: Function,
    primaryKey: Number,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    close: function () {
      this.$emit('close')
    },
    execDelete: async function () {
      if (!this.deleteFunc) {
        this.close()
      }

      this.loading = true
      const res = await this.deleteFunc?.(this.primaryKey)
      this.loading = false

      if (res?.status !== HttpStatus.OK) {
        return this.$toastr.error(this.$t('serverError'))
      }

      this.$toastr.success(this.$t('success'))
      this.$emit('deleted')
      this.close()
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
    z-index: 1051;
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
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
