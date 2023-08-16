<template>
  <div
    class="modal fade"
    id="kt_deposit_setting_edit_modal"
    ref="depositSettingEditModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">{{ title }}</h2>
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="p-5">
          <form class="mb-5">
            <div class="row mb-4">
              <div class="col-6 d-flex align-items-center">
                {{ $t('walletGeneral.coin') }}:
              </div>
              <div class="col-4 text-uppercase">
                {{ coinSelect }}
              </div>
            </div>
            <div class="row mb-4" v-for="(i, index) in item" :key="index">
              <div class="col-6 d-flex align-items-center">
                {{ $t(i.title) }}
              </div>
              <div class="col-4">
                <div
                  class="form-check form-switch"
                  v-if="
                    i.value.toString() == 'true' ||
                    i.value.toString() == 'false'
                  "
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    v-model="i.value"
                    :disabled="isDisableField(i.key)"
                  />
                  <label
                    class="form-check-label"
                    for="flexSwitchCheckDefault"
                  ></label>
                </div>
                <input
                  v-else-if="i.value.length > 15"
                  v-model="i.value"
                  type="text"
                  class="form-control"
                  :placeholder="$t(i.title)"
                  :disabled="isDisableField(i.key)"
                  required
                />
                <div v-else>
                  <imask-input
                    v-if="isInput999(i)"
                    v-model:value="i.value"
                    :mask="Number"
                    min="0"
                    max="999"
                    scale=""
                    :signed="false"
                    thousandsSeparator=""
                    :padFractionalZeros="false"
                    :normalizeZeros="true"
                    :placeholder="$t(i.title)"
                    class="form-control"
                    :disabled="isDisableField(i.key)"
                  />

                  <imask-input
                    v-else
                    v-model:value="i.value"
                    :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                    :placeholder="$t(i.title)"
                    class="form-control"
                    :disabled="isDisableField(i.key)"
                  />
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-6"></div>
              <div class="col-4">
                <button type="button" class="btn btn-success" @click="onClick">
                  {{ $t('update') }}
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
import { Actions } from '@/store/enums/StoreEnums'
import { IMaskComponent } from 'vue-imask'
import { ElMessageBox } from 'element-plus'
import { HttpStatus } from '@/core/variables/common.enum'
import _ from 'lodash'

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
    initData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    coin: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      coinOld: '',
      dataOld: {},
      coinSelect: this.coin,
      disableFields: [
        'DEPOSIT_ENABLE',
        'MAXIMUM_AUTO_WITHDRAW_THRESHOLD',
        'WITHDRAW_ENABLE',
        'MOTHER_WALLET_ADDRESS',
      ],
      ignoreDisableFields: ['AUTO_WITHDRAW_ENABLE'],
    }
  },
  updated() {
    this.dataOld = JSON.parse(JSON.stringify(this.item))
    this.coinOld = this.coin
    this.coinSelect = this.coin.toUpperCase()
  },
  computed: {
    listCoin() {
      return this.$store.getters.listCoin
    },
  },
  mounted() {
    this.$store.dispatch(Actions.FETCH_LIST_COIN)
  },
  methods: {
    isInput999(item) {
      switch (this.getKey(item.key)) {
        case 'DEPOSIT_CONFIRMATION':
        case 'WITHDRAW_CONFIRMATION':
        case 'NUMBER_WITHDRAW_TRANSACTION_LIMIT_BY_DAY':
          return true
      }
      return false
    },
    getKey(key) {
      return key.slice(this.coinSelect.length + 1, key.length)
    },
    onClick() {
      let isValid = 0
      let isNotMes = 0
      let isNumber = 0
      let isInteger = 0
      // let amountLimit = 0
      // let minAmountLimit = 0
      // let amountLimitByDay = 0
      let mother = 0
      let motherThreshold = 0
      let xrpMaintainBalance = 0

      let isChangeMaximumAutoWithdrawThreshold = false

      const maximumAutoWithdrawThresholdValue =
        this.initData.find(
          (item) => this.getKey(item.key) === 'MAXIMUM_AUTO_WITHDRAW_THRESHOLD',
        ) || {}

      if (!this.coinSelect) {
        return this.$toastr.error(this.$t('VALIDATION.field'))
      }

      const integerFieldKeys = ['NUMBER_WITHDRAW_TRANSACTION_LIMIT_BY_DAY']
      this.item.forEach((item, index) => {
        if (item.key === 'XRP_MOTHER_WALLET_MAINTAIN_BALANCE') {
          xrpMaintainBalance = +item.value
        }
        if (index) {
          // if (!item.value) isValid++
          if (+item.value < 0) isNumber++
          // let keys = item.key.split('_')
          // if (keys.includes('DAY') && key !=) {
          //   if (!Number.isInteger(+item.value)) {
          //     isInteger++
          //   }
          // }

          if (
            integerFieldKeys.includes(this.getKey(item.key)) &&
            !Number.isInteger(+item.value)
          ) {
            isInteger++
          }
          // if (this.getKey(item.key) === 'WITHDRAW_AMOUNT_LIMIT') {
          //   amountLimit = +item.value
          // } else
          // if (this.getKey(item.key) === 'WITHDRAW_AMOUNT_LIMIT_BY_DAY') {
          // amountLimitByDay = +item.value
          // } else if (this.getKey(item.key) === 'MIN_WITHDRAW_AMOUNT_LIMIT') {
          //   minAmountLimit = +item.value
          // } else
          if (this.getKey(item.key) === 'MOTHER_WALLET_ALERT_THRESHOLD') {
            mother = +item.value
          } else if (
            this.getKey(item.key) === 'MOTHER_WALLET_AUTO_COLLECTION_THRESHOLD'
          ) {
            motherThreshold = +item.value
          }
          let arr
          switch (this.getKey(item.key)) {
            case 'DEPOSIT_CONFIRMATION':
            case 'WITHDRAW_CONFIRMATION':
            case 'NUMBER_WITHDRAW_TRANSACTION_LIMIT_BY_DAY':
              item.value = item.value.toString().replace(/[,]/g, '.')
              arr = item.value.toString().split('.')
              if (arr.length > 1 || +item.value < 1 || +item.value > 999) {
                setTimeout(() => {
                  this.$toastr.error(
                    this.$t('VALIDATION.FIELD_NUMBER', {
                      field: this.$t(
                        `walletGeneral.${_.camelCase(this.getKey(item.key))}`,
                      ),
                      min: 1,
                      max: 999,
                    }),
                  )
                }, 100)
                isNotMes++
              }
              break
            case 'USER_MAX_AMOUNT':
            case 'MAXIMUM_AUTO_WITHDRAW_THRESHOLD':
              if (item.value !== maximumAutoWithdrawThresholdValue.value) {
                isChangeMaximumAutoWithdrawThreshold = true
              }

              break
            case 'WITHDRAW_AMOUNT_LIMIT_BY_DAY':
            case 'MOTHER_WALLET_ALERT_THRESHOLD':
            case 'MOTHER_WALLET_AUTO_COLLECTION_THRESHOLD':
              if (+item.value <= 0 || +item.value > 999999999) {
                setTimeout(() => {
                  this.$toastr.error(
                    this.$t('VALIDATION.FIELD_NUMBER', {
                      field: this.$t(
                        `walletGeneral.${_.camelCase(this.getKey(item.key))}`,
                      ),
                      min: 0,
                      max: 999999999,
                    }),
                  )
                }, 100)
                isNotMes++
              }
              break
          }
        }
      })
      // if (this.$route.name === 'walletSetting.withdrawSetting') {
      //   if (amountLimit >= amountLimitByDay) {
      //     this.$toastr.error(this.$t('VALIDATION.amountLimitByDay'))
      //     isNotMes++
      //   }

      //   if (minAmountLimit >= amountLimit) {
      //     setTimeout(() => {
      //       this.$toastr.error(this.$t('VALIDATION.amountLimit'))
      //     }, 100)
      //     isNotMes++
      //   }
      // }

      if (this.$route.name === 'walletSetting.motherWalletSetting') {
        if (mother >= motherThreshold) {
          this.$toastr.error(this.$t('VALIDATION.mother'))
          isNotMes++
        }
        if (this.coin == 'xrp' && xrpMaintainBalance < 15) {
          setTimeout(() => {
            this.$toastr.error(
              this.$t('VALIDATION.FIELD_NUMBER', {
                field: this.$t('walletGeneral.motherWalletMaintainBalance'),
                min: 15,
                max: 999999999,
              }),
            )
          }, 100)
          isNotMes++
        }
      }

      if (isNotMes) return
      if (isNumber)
        return this.$toastr.error(this.$t('VALIDATION.notLessThanZero'))
      if (isValid) return this.$toastr.error(this.$t('VALIDATION.field'))
      if (isInteger) return this.$toastr.error(this.$t('VALIDATION.isInteger'))

      if (this.isEdit) {
        ElMessageBox.confirm(this.$t('walletGeneral.areYouSureToUpdate')).then(
          () => {
            let param = {
              wallet_settings: [],
            }
            this.item.forEach((item) => {
              param.wallet_settings.push({
                key: item.key,
                value: item.value.toString(),
                show: item.show,
              })
            })
            WalletSettingService.updateWalletSetting(param)
              .then((res) => {
                if (res.status === HttpStatus.OK) {
                  this.$emit('updateData')

                  if (isChangeMaximumAutoWithdrawThreshold) {
                    this.$emit('warningModal')
                  }

                  this.$toastr.success(this.$t('success'))

                  hideModal(this.$refs.depositSettingEditModalRef)
                } else {
                  this.$toastr.error(this.$t('error'))
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
          let param = {
            wallet_settings: [],
          }
          this.item.forEach((item) => {
            const keys = item.key.split('_')
            keys[0] = this.coinSelect
            param.wallet_settings.push({
              key: keys.join('_'),
              value: item.value.toString(),
              show: item.show,
              chain_code: this.coinSelect,
            })
          })
          WalletSettingService.createWalletSetting(param)
            .then((res) => {
              if (res.status === HttpStatus.OK) {
                this.$emit('updateData')
                this.$toastr.success(this.$t('success'))
                hideModal(this.$refs.depositSettingEditModalRef)
              } else {
                this.$toastr.error(this.$t('error'))
              }
            })
            .catch(() => {
              this.$toastr.error(this.$t('error'))
            })
        },
      )
    },
    isDisableField(key) {
      if (this.ignoreDisableFields.some((item) => key && key.includes(item))) {
        return false
      }

      return this.disableFields.some((item) => key && key.includes(item))
    },
  },
}
</script>
