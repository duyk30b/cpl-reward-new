<template>
  <BaseModal
    :title="'Edit exchange OBM'"
    :show="show"
    @close="close"
    :dialog-class="'edit-exchange-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="editExchangeForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="exchange" class="form-label"> Exchange </label>
              <select name="exchange" v-model="exchange" class="form-control">
                <option
                  v-for="item of exchangeList"
                  :key="item.exchange"
                  :value="item"
                >
                  {{ `${item.exchange.toUpperCase()}` }}
                </option>
              </select>
            </div>
            <div class="mb-10">
              <label for="token" class="form-label"> Token </label>
              <Field
                name="token"
                type="text"
                as="input"
                :rules="`required`"
                v-model="token"
                class="form-control"
              />
              <ErrorMessage name="token" class="text-danger" />
            </div>
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.save') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Swal from 'sweetalert2'
import { HttpStatus } from '@/core/variables/common.enum'
import { SettingOBMService } from '@/services/SettingOBMService'
import { ObmExchangeSettingItemDTO } from '@/models/setting-obm/GeneralOBM'

export default defineComponent({
  name: 'edit-exchange-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      token: '',
      exchange: {} as ObmExchangeSettingItemDTO,
      exchangeList: [] as ObmExchangeSettingItemDTO[],
    }
  },
  async mounted() {
    await this.getExchange()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getExchange() {
      const result = await SettingOBMService.getObmExchangeList()
      if (result.status != HttpStatus.OK) {
        this.$toastr.error('create pair error!')
        this.exchangeList = []
        return
      }
      this.exchangeList = result.data.data
      if (this.exchangeList.length > 0) this.exchange = this.exchangeList[0]
    },
    async submitForm() {
      const form = await (this.$refs.editExchangeForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      if (
        this.exchange?.balances?.find(
          (item) => item.token.toLowerCase() == this.token.toLowerCase(),
        )
      ) {
        this.$toastr.error('Token is exist!')
        return
      }
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to add token?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.exchange?.balances?.push({
            token: this.token,
            alert: '0',
            stop: '0',
            adjustBalancePercent: '10',
          })
          this.exchange.update_by = 'admin'
          delete this.exchange.status
          const result = await SettingOBMService.saveExchangeSetting([
            this.exchange,
          ])
          if (result.status != HttpStatus.OK) {
            this.$toastr.error('Add token error!')
            return
          }
          this.$toastr.success('Add token success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
    },
  },
})
</script>
