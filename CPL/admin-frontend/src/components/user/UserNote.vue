<template>
  <div class="card mb-5" v-if="checkPermission(Permission.USER_NOTE_READ)">
    <div class="card-header">
      <div class="card-title m-0 text-uppercase fw-bold">
        {{ $t('note') }}
      </div>
    </div>

    <div class="card-body pt-4">
      <Form
        @submit="createNote"
        v-slot="{ meta: formMeta }"
        ref="formEl"
        v-if="checkPermission(Permission.USER_NOTE_CREATE)"
      >
        <Field
          v-model="form.note"
          type="text"
          name="note"
          v-slot="{ field, errorMessage }"
          :rules="`required`"
        >
          <div class="form-group">
            <textarea rows="3" class="form-control" v-bind="field"></textarea>
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
        <button
          class="btn btn-sm btn-primary me-2"
          type="submit"
          :disabled="!formMeta.valid || loading.create"
        >
          {{ $t('submit') }}
        </button>
        <hr class="text-grey" />
      </Form>
      <div class="py-3" v-if="loading.notes">
        <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
      </div>
      <div class="py-3" v-else-if="!notes.length">
        {{ $t('noData') }}
      </div>
      <template v-else>
        <transition-group name="note" mode="out-in">
          <div
            class="user-note-section"
            v-for="note in showAll ? notes : notes.slice(0, 3)"
            :key="note.id"
          >
            <div class="d-flex flex-no-wrap align-items-baseline mb-2">
              <div
                class="user-note-admin"
                :title="note.admin?.email || $t('unknown')"
              >
                {{ note.admin?.displayName || $t('unknown') }}
              </div>
              <div class="user-note-time">
                {{
                  $filters.convertTimestampToDate(
                    note.createdAt,
                    'YYYY/MM/DD HH:mm',
                  )
                }}
              </div>
            </div>
            <div class="user-note-content">
              {{ note.note }}
            </div>
          </div>
        </transition-group>
        <div v-if="notes.length > 3">
          <a href="javascript:void(0)" @click="showAll = !showAll">{{
            showAll
              ? $t('hideItems', { count: notes.length - 3 })
              : `${$t('showAll')}...`
          }}</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserNote } from '@/models/user/UserNote'
import { UserNoteService } from '@/services/UserNoteService'
import { Permission, SubErrorCode } from '@/core/variables/common.enum'
import {
  checkPermission,
  formatServerErrors,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

export default defineComponent({
  name: 'user-note',
  components: { Form, Field, ErrorDisplay },
  async mounted() {
    await this.getData()
  },
  watch: {
    userId: async function () {
      await this.getData()
    },
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    notes: [] as UserNote[],
    showAll: false,
    loading: {
      notes: false,
      create: false,
    },
    form: new UserNote(),
    Permission,
  }),
  methods: {
    async getData() {
      await this.getUserNotes()
    },
    async getUserNotes() {
      if (!this.userId || !checkPermission(Permission.USER_NOTE_READ)) return
      this.loading.notes = true
      this.notes = await UserNoteService.findByUserId(this.userId)
      this.loading.notes = false
    },
    async createNote() {
      const res = await UserNoteService.create(this.userId, this.form.note)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        ;(this.$refs.formEl as any).resetForm()
        await this.getUserNotes()
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
    },
    checkPermission,
  },
})
</script>
<style lang="scss" scoped>
.user-note-section {
  border-radius: 4px;
  background-color: rgba(240, 242, 246, 1);
  padding: 8px 12px;
  margin-bottom: 16px;

  .user-note-admin {
    font-weight: bold;
    margin-right: 10px;
    font-size: 1.1em;
  }
  .user-note-time {
    color: #888;
  }
}
.note-enter-active,
.note-leave-active {
  transition: all 0.5s;
}
.note-enter-from,
.note-leave-to {
  opacity: 0;
  height: 0;
  padding-top: 0;
  padding-bottom: 0;

  * {
    display: none;
  }
}
</style>
