<template>
  <BaseModal
    :title="'Active user bot'"
    :show="show"
    @close="close"
    :dialog-class="'active-user-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="activeUserForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="email" class="form-label">
                {{ $t('setting.email') }}
              </label>
              <input
                name="user_id"
                type="text"
                as="input"
                disabled
                v-model="user.email"
                class="form-control"
              />
            </div>
            <div class="mb-10">
              <label for="user_id" class="form-label">
                {{ $t('setting.userId') }}
              </label>
              <input
                name="user_id"
                type="text"
                as="input"
                disabled
                v-model="user.user_id"
                class="form-control"
              />
            </div>
            <div class="mb-10">
              <label for="user_type" class="form-label">
                {{ $t('setting.userType') }}
              </label>
              <v-select
                :options="userTypeList"
                option-value="id"
                option-label="name"
                disabled
                v-model="user.user_type"
                searchable
                :can-deselect="false"
              ></v-select>
            </div>
            <template v-if="user.user_type == userTypeEnum.GATEKEEPER">
              <div class="mb-10">
                <label for="extend_orders" class="form-label">
                  {{ $t('setting.extendOrders') }}
                </label>
                <Field
                  name="extend_orders"
                  type="text"
                  as="input"
                  v-model="user.configure.extend_orders"
                  class="form-control"
                />
                <ErrorMessage name="extend_orders" class="text-danger" />
              </div>
              <div class="mb-10">
                <label for="expire_time" class="form-label">
                  {{ $t('setting.expireTime') }}
                </label>
                <Field
                  name="expire_time"
                  type="text"
                  as="input"
                  v-model="user.configure.expire_time"
                  class="form-control"
                />
                <ErrorMessage name="expire_time" class="text-danger" />
              </div>
            </template>
            <div class="mb-10">
              <label class="form-label"> {{ $t('setting.status') }} </label>
              <label
                class="
                  col-md-9
                  form-check form-switch form-check-custom form-check-solid
                "
              >
                <input
                  class="form-check-input"
                  name="status"
                  type="checkbox"
                  id="status_pair"
                  v-model="user.status"
                  :true-value="1"
                  :false-value="2"
                />
              </label>
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
import {
  BotSettingItem,
  BOT_STATUS_ENUM,
  BOT_TYPE_ENUM,
} from '@/models/setting-exchange/BotSetting'
import Swal from 'sweetalert2'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { HttpStatus } from '@/core/variables/common.enum'
import { plainToInstance } from 'class-transformer'

export default defineComponent({
  name: 'active-user-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    activeUser: {
      type: BotSettingItem,
      default: {},
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: plainToInstance(BotSettingItem, {
        ...this.activeUser,
        status: BOT_STATUS_ENUM.ACTIVE,
      }),
      userTypeEnum: BOT_TYPE_ENUM,
      userTypeList: [
        {
          id: 2,
          name: 'Bot_A',
        },
        {
          id: 3,
          name: 'Bot_P',
        },
        {
          id: 4,
          name: 'Gatekeeper',
        },
        {
          id: 5,
          name: 'Bot_MM',
        },
      ],
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async submitForm() {
      const form = await (this.$refs.activeUserForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to active bot?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await SettingExchangeService.updateBotSetting(
            this.user,
          )
          if (result.status != HttpStatus.OK) {
            this.$toastr.error('Active bot error!')
            return
          }
          this.$toastr.success('Active bot success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
    },
  },
})
</script>
