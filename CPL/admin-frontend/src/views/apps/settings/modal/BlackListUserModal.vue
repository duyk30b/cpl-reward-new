<template>
  <div class="modal blacklist">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">
            {{ isEdit ? $t('blacklistUser.update') : $t('blacklistUser.add') }}
          </h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="close"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="p-5">
          <form class="mb-5">
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">Email</div>
              <div class="col-6">
                <el-autocomplete
                  v-model="itemEdit.email"
                  :disabled="isEdit"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="true"
                  :class="
                    (!isValid && !itemEdit.user_id) ||
                    (!itemEdit.user_id &&
                      itemEdit.email &&
                      itemEdit.email.length >= 3)
                      ? 'is-invalid form-control form-control-solid mr-2 p-0'
                      : 'form-control form-control-solid mr-2 p-0'
                  "
                  placeholder=""
                  @change="handleSelect"
                  @select="handleSelect"
                  maxlength="255"
                />
                <span
                  class="invalid-feedback"
                  v-if="
                    (!isValid && !itemEdit.user_id) ||
                    (!itemEdit.user_id &&
                      itemEdit.email &&
                      itemEdit.email.length >= 3)
                  "
                  >{{
                    itemEdit.email && itemEdit.email.length >= 1
                      ? 'Email is invalid'
                      : 'Email is required'
                  }}</span
                >
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">User Id</div>
              <div class="col-6">
                <input
                  v-model="itemEdit.user_id"
                  placeholder=""
                  disabled
                  class="form-control"
                  maxlength="255"
                />
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">Note</div>
              <div class="col-6">
                <input
                  v-model="itemEdit.note"
                  type="text"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                />
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">Reason</div>
              <div class="col-6">
                <input
                  v-model="itemEdit.reason"
                  type="text"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4"></div>
              <div class="col-4">
                <button type="button" class="btn btn-success" @click="onClick">
                  {{ isEdit ? 'Update' : 'Add' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { hideModal } from '@/core/helpers/dom'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import { ElMessageBox } from 'element-plus'
import { USER_SEARCH_FIELD_MAP } from '@/models/user/User'

export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    isEdit() {
      return this.$route.query.isEdit == 'true'
    },
  },
  data() {
    return {
      itemEdit: {
        user_id: '',
        note: '',
        reason: '',
        id: '',
        email: '',
      },
      loading: false,
      isValid: true,
    }
  },
  mounted() {
    this.itemEdit = { ...this.item }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleSelect(item) {
      this.itemEdit.user_id = item.user_id || ''

      if (!this.isValid) {
        this.isValid = true
      }
    },
    async querySearch(queryString, cb) {
      const results = await ExchangeHistoryService.getUserByEmail({
        account_status: 1, // Skip get user deleted when add new
        is_banned: 0, // Skip get user banned when add new
        search_text: this.itemEdit.email.replace(/\s/g, ''),
        search_field: USER_SEARCH_FIELD_MAP.email,
        limit: 25,
        page: 1,
      })
      cb(
        results &&
          results.data &&
          results.data.data.map((item) => {
            return {
              value: item.email,
              user_id: item.user_id,
            }
          }),
      )
    },
    onClick() {
      if (!this.itemEdit.user_id) {
        this.isValid = false
        return
      }

      if (this.isEdit) {
        if (this.itemEdit.user_id != this.item.user_id) {
          this.$toastr.error(this.$t('error'))
          return
        }
        ElMessageBox.confirm('Are you sure to update?').then(() => {
          let param = { ...this.itemEdit }
          this.loading = true
          ExchangeHistoryService.updateBlacklistUser(param)
            .then((res) => {
              if (res && res.status === 200) {
                this.$emit('updateData')
                this.$toastr.success(this.$t('success'))
                hideModal(this.$refs.blackListModalRef)
              } else {
                let errorMessage = 'error'

                if (res.data.message) {
                  errorMessage = res.data.message
                }

                this.$toastr.error(this.$t(errorMessage))
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        return
      }

      ElMessageBox.confirm('Are you sure to add?').then(() => {
        let param = {
          ...this.itemEdit,
          user_id: this.itemEdit.user_id.toString(),
        }
        ExchangeHistoryService.addBlacklistUser(param).then((res) => {
          if (res && res.status === 200) {
            this.$emit('updateData')
            this.$toastr.success(this.$t('success'))
            hideModal(this.$refs.blackListModalRef)
          } else {
            let errorMessage = 'error'

            if (res.data.message) {
              errorMessage = res.data.message
            }

            this.$toastr.error(this.$t(errorMessage))
          }
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.blacklist {
  display: block;
  background-color: #00000080;
}
.p-0 {
  padding: 0;
}
</style>
