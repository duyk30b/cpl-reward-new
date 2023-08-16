<template>
  <div class="modal blacklist">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">
            {{ isEdit ? $t('update') : $t('create') }}
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
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.address') }}
              </div>
              <div class="col-6">
                <imask-input
                  name="address"
                  :mask="/[a-zA-Z0-9]+$/"
                  v-model="itemEdit.address"
                  :class="
                    !isValid && !itemEdit.address
                      ? 'form-control is-invalid'
                      : 'form-control'
                  "
                  placeholder=""
                  @change="onChange"
                  maxlength="255"
                />
                <span
                  class="invalid-feedback"
                  v-if="!isValid && !itemEdit.address"
                  >{{ $t('walletGeneral.addressIsRequired') }}</span
                >
              </div>
            </div>

            <!-- <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">Email</div>
              <div class="col-6">
                <input
                  v-model="itemEdit.email"
                  type="text"
                  class="form-control"
                  placeholder="EMAIL"
                  maxlength="255"
                />
              </div>
            </div> -->

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.source') }}
              </div>
              <div class="col-6">
                <input
                  v-model="itemEdit.source"
                  type="text"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.note') }}
              </div>
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
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.reason') }}
              </div>
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
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.chainCode') }}
              </div>
              <div class="col-6">
                <select
                  v-model="itemEdit.chain_code"
                  :class="
                    !isValid && !itemEdit.chain_code
                      ? 'form-control form-control-sm is-invalid'
                      : 'form-control form-control-sm'
                  "
                  placeholder=""
                  name="chain_code"
                  @change="onChange"
                >
                  <option
                    v-for="currency in listChainCode"
                    :value="currency"
                    :key="currency"
                  >
                    {{ currency.toUpperCase() }}
                  </option>
                </select>
                <span
                  class="invalid-feedback"
                  v-if="!isValid && !itemEdit.chain_code"
                  >{{ $t('walletGeneral.chainCodeIsRequired') }}</span
                >
              </div>
            </div>
            <!-- <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">Symbol</div>
              <div class="col-6">
                <select
                  v-if="itemEdit.chain_code === 'erc20'"
                  v-model="itemEdit.symbol"
                  :class="
                    !isValid && !itemEdit.symbol
                      ? 'form-control form-control-sm is-invalid'
                      : 'form-control form-control-sm'
                  "
                  placeholder=""
                  @change="onChange"
                  v
                >
                  <option
                    v-for="currency in listCoin"
                    :value="currency"
                    :key="currency"
                  >
                    {{ currency }}
                  </option>
                </select>
                <input
                  v-else
                  v-model="itemEdit.chain_code"
                  :disabled="itemEdit.chain_code != 'erc20'"
                  type="text"
                  :class="
                    !isValid && !itemEdit.chain_code
                      ? 'form-control form-control-sm text-uppercase is-invalid'
                      : 'form-control form-control-sm text-uppercase'
                  "
                  placeholder=""
                  @change="onChange"
                />
                <span
                  class="invalid-feedback"
                  v-if="!isValid && (!itemEdit.chain_code || !itemEdit.symbol)"
                  >Symbol is required</span
                >
              </div>
            </div> -->

            <div class="row mb-4">
              <div class="col-4"></div>
              <div class="col-4">
                <button type="button" class="btn btn-success" @click="onClick">
                  {{ isEdit ? $t('update') : $t('create') }}
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
import { WalletSettingService } from '@/services/WalletSettingService'
import { IMaskComponent } from 'vue-imask'
import { ElMessageBox } from 'element-plus'

export default {
  components: {
    'imask-input': IMaskComponent,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
    listChainCode: {
      type: Array,
      default: () => {
        return []
      },
    },
    listCoin: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      itemEdit: {
        address: '',
        email: '',
        chain_code: '',
        symbol: '',
        source: '',
        note: '',
        reason: '',
        id: '',
      },
      riskList: ['UNKNOWN', 'LOW', 'MEDIUM', 'HIGH'],
      isValid: true,
    }
  },
  computed: {
    isEdit() {
      return this.$route.query.isEdit == 'true'
    },
  },
  async mounted() {
    this.itemEdit = { ...this.item }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onChange(event) {
      const { name, value } = event.target
      if (name === 'chain_code') {
        this.itemEdit.symbol = value === 'erc20' ? '' : value
      }

      if (!this.isValid) {
        this.isValid = true
      }
    },
    onClick() {
      if (this.itemEdit.chain_code !== 'erc20') {
        this.itemEdit.symbol = this.itemEdit.chain_code
      }

      if (!this.itemEdit.address || !this.itemEdit.chain_code) {
        this.isValid = false

        return
      }

      if (this.isEdit) {
        if (!this.itemEdit.id) {
          this.$toastr.error(this.$t('error'))
          return
        }
        ElMessageBox.confirm(this.$t('walletGeneral.areYouSureToUpdate')).then(
          () => {
            let param = { ...this.itemEdit }
            param.chain_code = param.chain_code.toLowerCase()
            param.symbol = param.symbol.toLowerCase()
            WalletSettingService.updateBlacklistAddress(param)
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
              })
              .catch(() => {
                this.$toastr.error(this.$t('error'))
              })
          },
        )
        return
      }
      ElMessageBox.confirm(this.$t('walletGeneral.areYouSureToAdd')).then(
        () => {
          let param = { data: [{ ...this.itemEdit }] }
          param.data[0].chain_code = param.data[0].chain_code.toLowerCase()
          param.data[0].symbol = param.data[0].symbol.toLowerCase()
          delete param.data[0].id
          WalletSettingService.addBlacklistAddress(param)
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
            })
            .catch(() => {
              this.$toastr.error(this.$t('error'))
            })
        },
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.blacklist {
  display: block;
  background-color: #00000080;
}
</style>
