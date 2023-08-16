<template>
  <div
    class="modal fade"
    id="edit-currency-modal"
    ref="editCurrencyModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <Form
          ref="editCurrencyForm"
          :validation-schema="validateSchema"
          @submit="submitForm"
        >
          <div class="modal-header">
            <h5 class="modal-title fw-600">
              {{ $t('currencyScreen.editCurrencyModal.title') }}
            </h5>

            <!--begin::Close-->
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fas fa-times"></i>
            </div>
            <!--end::Close-->
          </div>

          <div class="modal-body" v-if="coin?.network_detail">
            <div class="form-group">
              <label class="fw-700">{{ $t('currencyScreen.coin') }}</label>
              <el-select
                class="form-select-solid"
                :placeholder="$t('currencyScreen.coin')"
                v-model="coinSelected"
                clearable
                filterable
              >
                <el-option
                  v-for="coin in listCoin"
                  :value="coin.key"
                  :key="coin.key"
                  :label="coin.coin"
                >
                </el-option>
              </el-select>
            </div>

            <div class="form-group">
              <label class="fw-700">{{ $t('currencyScreen.coinName') }}</label>
              <imask-input
                name="coin_name"
                :mask="/[a-zA-Z0-9\s]+$/"
                v-model="coin.name"
                class="form-control"
                maxlength="255"
              />
              <Field
                name="coin_name"
                as="input"
                class="form-control d-none"
                v-model="coin.name"
              />
              <span v-if="coinNameError" class="text-danger">{{
                coinNameError
              }}</span>
              <ErrorMessage v-else name="coin_name" class="text-danger" />
            </div>

            <div>
              <span class="token-type fw-600">
                {{ $t('currencyScreen.registerNewCurrencyScreen.type') }}:
                {{ coin.network_detail.type.toUpperCase() }}</span
              >

              <div>
                <span class="token-info-label"
                  >{{
                    $t(
                      'currencyScreen.registerNewCurrencyScreen.contractAddress',
                    )
                  }}:
                </span>
                <span class="token-info-value">{{
                  coin.network_detail.contract_address
                }}</span>
              </div>

              <div>
                <span class="token-info-label"
                  >{{ $t('currencyScreen.registerNewCurrencyScreen.env') }}:
                </span>
                <span class="token-info-value">{{
                  coin.network_detail.env
                }}</span>
              </div>

              <div>
                <span class="token-info-label"
                  >{{
                    $t('currencyScreen.registerNewCurrencyScreen.decimals')
                  }}:
                </span>
                <span class="token-info-value">{{
                  coin.network_detail.decimal
                }}</span>
              </div>

              <div>
                <span class="token-info-label"
                  >{{
                    $t(
                      'currencyScreen.registerNewCurrencyScreen.transactionExplorer',
                    )
                  }}:
                </span>
                <span class="token-info-value">{{
                  coin.network_detail.transaction_explorer
                }}</span>
              </div>

              <div>
                <span class="token-info-label"
                  >{{
                    $t(
                      'currencyScreen.registerNewCurrencyScreen.transactionPath',
                    )
                  }}:
                </span>
                <span class="token-info-value">{{
                  coin.network_detail.transaction_tx_path
                }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-save"
              :data-kt-indicator="isSubmitting ? 'on' : ''"
              :disabled="isSubmitting"
              @click="submitForm"
            >
              <span class="indicator-label"> {{ $t('save') }} </span>
              <span class="indicator-progress">
                {{ $t('save') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { hideModal } from '@/core/helpers/dom'
import { CurrencyService } from '@/views/currency/services/CurrencyService'
import { HttpStatus } from '@/core/variables/common.enum'
import * as Yup from 'yup'
import { IMaskComponent } from 'vue-imask'

export default defineComponent({
  name: 'EditCurrencyModal',
  props: ['currencyEdit', 'allCoins'],
  components: { Form, Field, ErrorMessage, 'imask-input': IMaskComponent },

  data() {
    return {
      coin: null,
      coinSelected: '',
      listCoin: [],
      isSubmitting: false,
      validateSchema: Yup.object().shape({}),
      coinNameError: '',
    }
  },
  created() {
    this.initValidate()
  },
  methods: {
    async submitForm() {
      // reset error before check
      this.coinNameError = ''

      const editCurrencyForm = this.$refs.editCurrencyForm as any
      const form = await editCurrencyForm.validate()
      const coin: any = this.coin
      if (!form.valid) {
        return
      }

      await this.checkValidParams()
      if (this.coinNameError) {
        return
      }

      const params = {
        coin: coin.coin,
        coin_name: coin.name,
        env: coin.network_detail.env,
      }

      this.isSubmitting = true
      try {
        const { data } = await CurrencyService.updateCurrency(params)
        if (data?.response?.status_code === HttpStatus.BAD_REQUEST) {
          this.$toastr.error(
            this.$t('currencyScreen.editCurrencyModal.editCurrencyFail'),
          )
        }
        this.isSubmitting = false
        this.editCurrencySuccess()
        this.$toastr.success(
          this.$t('currencyScreen.editCurrencyModal.editCurrencySuccess'),
        )
      } catch (err) {
        this.$toastr.error(
          this.$t('currencyScreen.editCurrencyModal.editCurrencyFail'),
        )
        this.isSubmitting = false
        this.closeModal()
      }
    },
    initValidate() {
      const validateSchema = Yup.object().shape({
        coin_name: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_required',
            ),
          )
          .max(255)
          .matches(/^[^`!@#$%^&*()+\\=\\[\]{};':"\\|,.<>\\/?~]*$/, {
            message: this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_special',
            ),
            excludeEmptyString: true,
          }),
      })
      this.validateSchema = validateSchema
    },
    // check valid currency
    async checkValidParams(this: any) {
      const coin: any = this.coin

      // 1 check coin name empty
      if (!coin.name.trim()) {
        this.coinNameError = this.$t(
          'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_required',
        )
        return
      }

      // 2 check coin name unique
      this.isSubmitting = true
      const { data } = await CurrencyService.checkValidCurrency({
        coin_name: coin.name,
        coin_edit: coin.coin,
      })
      this.isSubmitting = false

      // 3. handle errors
      if (!data.result) {
        const errors = data?.response?.errors ?? null

        // handle contract address error from server
        if (errors?.coin_name) {
          if (errors?.coin_name.includes('validation.unique')) {
            this.coinNameError = this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_exist',
            )
          }
        }
      }
    },
  },
  mounted() {
    const myModalEl = document.getElementById(
      'edit-currency-modal',
    ) as HTMLElement
    myModalEl.addEventListener('shown.bs.modal', () => {
      this.coinNameError = ''
      const coin = { ...this.currencyEdit }
      const coinNetwork = coin?.networks?.[0] ?? null
      coin['network_detail'] = coinNetwork
      coin['key'] = `${coin.coin}-${coin?.networks?.[0]?.env}`
      this.coin = coin
      this.coinSelected = `${coin.coin}-${coin?.networks?.[0]?.env}`
    })
  },
  watch: {
    coinSelected: function (newVal) {
      if (newVal) {
        const [symbol, env] = newVal.split('-')
        const coin = this.listCoin.find((item: any) => {
          const coinNetwork = item?.networks?.[0] ?? null
          return item.coin === symbol && coinNetwork.env === env
        })
        if (coin) {
          ;(this.coin as any) = coin
        }
      }
    },
    allCoins: function (newVal) {
      const newListCurrency = newVal.map((currency) => {
        return {
          ...currency,
          key: `${currency.coin}-${currency?.networks?.[0]?.env}`,
          network_detail: currency?.networks?.[0] ?? null,
        }
      })
      this.listCoin = newListCurrency
    },
    '$i18n.locale': function () {
      this.initValidate()
    },
  },
  setup(props, { emit }) {
    const editCurrencyModalRef = ref(null)

    const closeModal = () => {
      hideModal(editCurrencyModalRef.value)
    }

    const editCurrencySuccess = async () => {
      emit('editCurrencySuccess')
      hideModal(editCurrencyModalRef.value)
    }

    return {
      editCurrencyModalRef,
      editCurrencySuccess,
      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/edit_currency_modal.scss';
</style>
