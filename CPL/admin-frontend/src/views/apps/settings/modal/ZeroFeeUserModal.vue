<template>
  <div class="modal blacklist">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">
            {{ isEdit ? $t('zeroFeeUser.update') : $t('zeroFeeUser.add') }}
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
              <div class="col-4 d-flex align-items-center">All Pairs</div>
              <div class="col-4 d-flex align-items-center">
                <input
                  v-model="itemEdit.all_pair"
                  type="checkbox"
                  @change="check($event)"
                />
              </div>
              <div class="col-4">
                <button type="button" class="btn btn-success" @click="onClick">
                  {{ isEdit ? 'Update' : 'Add' }}
                </button>
              </div>
            </div>

            <div class="row mb-4">
              <PickPairCategory
                ref="pick_pair"
                @changeCheckBox="handleChangeCheckBox"
              />
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
import PickPairCategory from '@/components/exchange-setting/PickPairCategory.vue'
import { PAIR_STATUS } from '@/core/variables/common.enum'
import CONFIG from '@/config'

export default {
  components: {
    PickPairCategory,
  },
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
        id: '',
        email: '',
        all_pair: false,
      },
      listPairs: [],
      selectedPairs: [],
      loading: false,
      isValid: true,
      PAIR_STATUS,
    }
  },
  mounted() {
    this.itemEdit = { ...this.item }
    this.getListPair()
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
    async getListPair() {
      const res = await ExchangeHistoryService.getPairList()

      if (res && res.data && res.data.data) {
        this.listPairs = res.data.data
        this.parsePairList()
      }
    },
    getPairSelectedFromRef() {
      const pickPairData = this.$refs.pick_pair.getPairSelected()

      this.selectedPairs = pickPairData.length
        ? pickPairData.map((p) => ({ coin: p.coin, currency: p.currency }))
        : []

      this.populateCheckAll()
    },
    handleChangeCheckBox() {
      this.getPairSelectedFromRef()
    },
    populateCheckAll() {
      let checkAll = true

      const currencyList = CONFIG.CURRENCY_LIST

      this.listPairs.forEach((p) => {
        if (!currencyList.includes(p.currency)) return

        const isChecked = this.selectedPairs.find(
          (i) => i.currency === p.currency && i.coin === p.coin,
        )
        if (!isChecked) {
          checkAll = false
        }
      })

      this.itemEdit.all_pair = checkAll
    },
    setPairSelectedInRef() {
      let checkAll = true
      for (const item of this.$refs.pick_pair.currencyList) {
        item.pairList = item.pairList.map((pair) => {
          const isChecked = this.selectedPairs.find(
            (i) => i.currency === pair.currency && i.coin === pair.coin,
          )

          if (!isChecked) {
            checkAll = false
          }

          return {
            coin: pair.coin,
            currency: pair.currency,
            status: isChecked ? PAIR_STATUS.ACTIVE : PAIR_STATUS.INACTIVE,
          }
        })
      }

      this.itemEdit.all_pair = checkAll
    },
    parsePairList() {
      const selectedPairs = []

      if (
        this.itemEdit &&
        this.itemEdit.pairs &&
        this.itemEdit.pairs.split(',').length
      ) {
        this.itemEdit.pairs.split(',').forEach((i) => {
          if (i.length) {
            const pairSplit = i.split('/')
            selectedPairs.push({
              coin: pairSplit[0],
              currency: pairSplit[1],
            })
          }
        })
      }

      this.selectedPairs = selectedPairs

      this.setPairSelectedInRef()
    },
    check(e) {
      this.$nextTick(() => {
        const checked = this.itemEdit.all_pair

        if (checked) {
          this.selectedPairs =
            this.listPairs && this.listPairs.length
              ? this.listPairs.map((i) => ({
                  coin: i.coin,
                  currency: i.currency,
                }))
              : []
        } else {
          this.selectedPairs = []
        }

        this.setPairSelectedInRef()
      })
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

      let userBlacklistByKeyword = []

      if (this.itemEdit.email !== '') {
        const userBlacklists = await ExchangeHistoryService.getBlacklistUser({
          keyword: this.itemEdit.email.replace(/\s/g, ''),
          search_by_field: USER_SEARCH_FIELD_MAP.email,
        })

        userBlacklistByKeyword =
          userBlacklists && userBlacklists.data && userBlacklists.data.data
            ? userBlacklists.data.data
            : []
      }

      cb(
        results &&
          results.data &&
          results.data.data
            .filter(
              (u) =>
                !userBlacklistByKeyword.find((x) => (x.user_id = u.user_id)),
            )
            .map((item) => {
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

          this.getPairSelectedFromRef()

          if (this.selectedPairs && this.selectedPairs.length) {
            param.pairs = this.selectedPairs
          } else {
            param.pairs = []
            this.$toastr.error('You must select at least one pair')
            return
          }
          this.loading = true
          ExchangeHistoryService.updateZeroFeeUser(param)
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

        this.getPairSelectedFromRef()

        if (this.selectedPairs && this.selectedPairs.length) {
          param.pairs = this.selectedPairs
        } else {
          param.pairs = []
          this.$toastr.error('You must select at least one pair')
          return
        }

        ExchangeHistoryService.updateZeroFeeUser(param).then((res) => {
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
