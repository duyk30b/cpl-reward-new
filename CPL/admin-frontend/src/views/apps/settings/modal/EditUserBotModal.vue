<template>
  <BaseModal
    :title="'Change User Bot'"
    :show="show"
    @close="close"
    :dialog-class="'edit-user-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="editUserForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="email" class="form-label"
                >{{ $t('setting.currentEmailBot') }}
              </label>
              <Field
                name="email"
                type="text"
                as="input"
                disabled
                v-model="user.email"
                class="form-control"
              />
              <ErrorMessage name="email" class="text-danger" />
            </div>
            <div class="mb-10">
              <label for="user_id" class="form-label">
                {{ $t('setting.currentIdBot') }}
              </label>
              <Field
                name="user_id"
                type="text"
                as="input"
                disabled
                :rules="`required`"
                v-model="user.user_id"
                class="form-control"
              />
              <ErrorMessage name="user_id" class="text-danger" />
            </div>
            <div class="mb-10">
              <label for="new_email" class="form-label">
                {{ $t('setting.changeToEmail') }}
              </label>
              <div class="change-email row">
                <el-autocomplete
                  v-model="newEmail"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="true"
                  placeholder=""
                  @change="handleSelect"
                  @select="handleSelect"
                  maxlength="255"
                />
              </div>
              <ErrorMessage name="new_id" class="text-danger" />
            </div>
            <div class="mb-10">
              <label for="new_id" class="form-label">
                {{ $t('setting.changeToId') }}
              </label>
              <Field
                name="new_id"
                type="text"
                as="input"
                :rules="`required`"
                disabled
                v-model="newId"
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
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.change') }}
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
  BOT_TYPE,
  BOT_TYPE_ENUM,
} from '@/models/setting-exchange/BotSetting'
import { plainToInstance } from 'class-transformer'
import Swal from 'sweetalert2'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'edit-user-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    editUser: {
      type: Object,
      default: new BotSettingItem(),
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: plainToInstance(BotSettingItem, this.editUser, {
        exposeDefaultValues: true,
      }),
      isValid: false,
      newEmail: '',
      newId: '',
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
    async querySearch(queryString, cb) {
      const results = await SettingExchangeService.getBotList({
        user_type: this.user.user_type,
        page: 0,
        per_page: 100,
      })
      cb(
        results?.data?.data
          ?.filter((item) => {
            return (
              item.email.indexOf(this.newEmail) >= 0 &&
              item.status == BOT_STATUS_ENUM.IN_ACTIVE
            )
          })
          .map((item) => {
            return {
              value: item.email,
              user_id: item.user_id,
            }
          }),
      )
    },
    handleSelect(item) {
      this.newId = item.user_id || ''

      if (!this.isValid) {
        this.isValid = true
      }
    },
    async submitForm() {
      const form = await (this.$refs.editUserForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to change ${BOT_TYPE[this.user.user_type]} to ${
          this.newEmail
        }?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await SettingExchangeService.updateBotSetting({
            ...this.user,
            email: this.newEmail,
            user_id: this.newId,
          })
          if (result.status != HttpStatus.OK) {
            this.$toastr.error('Update bot error!')
            return
          }
          this.$toastr.success('Update bot success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
    },
  },
})
</script>
