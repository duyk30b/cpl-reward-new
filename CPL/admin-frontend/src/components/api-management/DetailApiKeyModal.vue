<template>
  <BaseModal
    :title="$t('apiKeyManagement.detailApiKey')"
    :show="show"
    @close="close"
    :dialog-class="`modal-lg`"
  >
    <template v-slot:body>
      <div class="section-block">
        <div class="row mb-4 info-section">
          <div class="col-xl-12">
            <div class="info-field">
              <label class="label">{{ $t('userId') }}</label>
              <div class="value">{{ this.detailApiKey.user_id }}</div>
            </div>
            <div class="info-field">
              <label class="label">{{ $t('email') }}</label>
              <div class="value">{{ this.detailApiKey.email }}</div>
            </div>
            <div class="info-field">
              <label class="label">{{ $t('apiKeyManagement.apiName') }}</label>
              <div class="value">{{ this.detailApiKey.api_name }}</div>
            </div>
            <div class="info-field">
              <label class="label">{{ $t('apiKeyManagement.apiKey') }}</label>
              <div class="value">{{ this.detailApiKey.api_key }}</div>
            </div>
            <div class="info-field">
              <label class="label">{{
                $t('apiKeyManagement.apiRestriction')
              }}</label>
              <div class="value">
                {{ getApiRestriction(this.detailApiKey.scopes) }}
              </div>
            </div>
            <div class="info-field">
              <label class="label">{{ $t('createdAt') }}</label>
              <div class="value">
                {{ this.detailApiKey.created_at }}
              </div>
            </div>
            <div class="info-field">
              <label class="label">{{ $t('updatedAt') }}</label>
              <div class="value">
                {{ this.detailApiKey.updated_at }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form ref="apiKeyForm" @submit="saveRequestStatus">
        <div class="form-group">
          <div class="col-lg-12">
            <label for="key" class="form-label required">
              {{ $t('apiKeyManagement.comment') }}
            </label>
            <textarea
              required
              type="text"
              class="form-control form-control-lg px-5"
              name="comment"
              maxlength="65535"
              v-model="comment"
              rows="5"
              :class="{
                'input-comment-fail': validateResult.comment !== '',
              }"
            />
            <span style="color: red" v-if="validateResult.comment !== ''">{{
              validateResult.comment
            }}</span>
          </div>
        </div>
      </form>
      <div class="form-group">
        <div class="col-lg-12">
          <label class="form-label">
            {{ $t('apiKeyManagement.histories') }}
          </label>
          <div
            class="section-block"
            style="max-height: 10rem; overflow-y: scroll"
          >
            <div class="row mb-4 info-section mx-0">
              <div
                class="col-xl-12 info-field"
                v-for="history in statusHistories"
                :key="history.id"
              >
                <div class="value">
                  AdminId: {{ history.admin_id }} change status from
                  <span
                    class="badge"
                    :class="{
                      'badge-light-success':
                        history.before_status === status.ENABLE,
                      'badge-light-danger':
                        history.before_status === status.DISABLE,
                    }"
                    >{{ getTextStatus(history.before_status) }}</span
                  >
                  to
                  <span
                    class="badge"
                    :class="{
                      'badge-light-success':
                        history.after_status === status.ENABLE,
                      'badge-light-danger':
                        history.after_status === status.DISABLE,
                    }"
                    >{{ getTextStatus(history.after_status) }}</span
                  >
                  , comment:
                  {{ concatCommentHistory(history.comment) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn"
        :class="classObjectSubmitButton"
        @click="submitForm"
        :data-kt-indicator="loading ? 'on' : ''"
        :disabled="loading"
      >
        {{ classObjectSubmitText }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { ApiManagementService } from '@/services/ApiManagementService'
import { HttpStatus } from '@/core/variables/common.enum'
import { convertTimestampToDate } from '@/core/helpers/common.helper'

const SCOPES = {
  reading: 'Read Only',
  trading: 'Enable Trading',
  withdrawal: 'Enable Withdrawals',
}

enum STATUS {
  ENABLE = 1,
  DISABLE = 2,
}

export default defineComponent({
  name: 'detail-api-key-modal',
  components: { BaseModal },
  props: {
    show: Boolean,
    id: String,
  },
  async beforeMount() {
    await this.getDetailApiKey(this.id)
  },
  computed: {
    classObjectSubmitButton() {
      return {
        'btn-danger': this.detailApiKey.status === STATUS.ENABLE,
        'btn-success': this.detailApiKey.status === STATUS.DISABLE,
      }
    },
    classObjectSubmitText() {
      if (this.detailApiKey.status === STATUS.ENABLE)
        return this.$t('apiKeyManagement.disableStatus')
      if (this.detailApiKey.status === STATUS.DISABLE)
        return this.$t('apiKeyManagement.enableStatus')
      return 'N/A'
    },
  },
  data() {
    return {
      status: STATUS,
      loading: false,
      detailApiKey: {
        id: '',
        user_id: '',
        email: '',
        api_key: '',
        api_name: '',
        scopes: [],
        created_at: '',
        status: 0,
        updated_at: '',
      },
      statusHistories: [
        {
          id: '',
          admin_id: '',
          comment: '',
          before_status: 0,
          after_status: 0,
        },
      ],
      comment: '',
      validateResult: {
        comment: '',
      },
    }
  },
  methods: {
    resetValidateResult() {
      this.validateResult = {
        comment: '',
      }
    },
    concatCommentHistory(comment: string) {
      if (comment.length <= 30) return comment

      return comment.substring(0, 30).concat('...')
    },
    getTextStatus(status: number) {
      if (status === STATUS.ENABLE)
        return this.$t('apiKeyManagement.enableStatus')
      if (status === STATUS.DISABLE)
        return this.$t('apiKeyManagement.disableStatus')
      return 'N/A'
    },
    getApiRestriction(scopes: string[]) {
      const restrictions = [] as string[]
      for (const scope of scopes) {
        restrictions.push(SCOPES[scope])
      }
      return restrictions.join(', ')
    },
    async getStatusHistories(apiKeyId) {
      const result = await ApiManagementService.getStatusHistories(apiKeyId)
      if (result.status === HttpStatus.OK) return result.data

      return []
    },
    async getDetailApiKey(id) {
      this.loading = true
      const result = await ApiManagementService.detailKey(id)
      if (result.status === HttpStatus.OK) {
        this.detailApiKey = result.data
        this.detailApiKey.created_at = convertTimestampToDate(
          this.detailApiKey.created_at,
          'YYYY-MM-DD HH:mm:ss',
        )
        this.detailApiKey.updated_at = convertTimestampToDate(
          this.detailApiKey.updated_at,
          'YYYY-MM-DD HH:mm:ss',
        )

        this.statusHistories = await this.getStatusHistories(
          this.detailApiKey.id,
        )
        this.loading = false
      }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      const apiKeyForm = this.$refs.apiKeyForm as HTMLFormElement
      apiKeyForm.requestSubmit()
    },
    async saveRequestStatus(e) {
      e.preventDefault()
      this.loading = true
      const result = await ApiManagementService.approveKeyRequest({
        id: this.detailApiKey.id,
        comment: this.comment,
      })
      this.loading = false

      console.log(result)

      if (result.status !== HttpStatus.CREATED) {
        const data = result.data
        if (
          data.status_code === HttpStatus.BAD_REQUEST &&
          data.message === 'VALIDATION.FAIL'
        ) {
          const errors = data.errors
          for (const error of errors) {
            this.validateResult[error.property] = error.msg
          }
        }

        return this.$toastr.error(
          this.$t('apiKeyManagement.approveRequestFailed'),
        )
      }

      this.$toastr.success(this.$t('apiKeyManagement.approveRequestSuccess'))
      this.$emit('updated')
      this.resetValidateResult()
      return this.close()
    },
  },
})
</script>

<style lang="scss" scoped>
textarea[name='comment'] {
  resize: none;
}
.input-comment-fail,
.input-comment-fail textarea {
  border-color: red;
}
</style>
