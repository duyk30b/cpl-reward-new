<template>
  <BaseModal
    :title="'Add User Bot'"
    :show="show"
    @close="close"
    :dialog-class="'add-user-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="addUserForm" v-slot="{ errors }">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="email" class="form-label">
                {{ $t('setting.email') }}
              </label>
              <div class="d-flex justify-content-between">
                <div class="col-sm-9">
                  <div class="change-email row">
                    <el-autocomplete
                      v-model="user.email"
                      :fetch-suggestions="querySearch"
                      :trigger-on-focus="true"
                      placeholder=""
                      @change="handleSelect"
                      @select="handleSelect"
                      maxlength="255"
                    />
                  </div>
                  <ErrorMessage name="user_id" class="text-danger" />
                </div>
                <div class="col-sm-2">
                  <button
                    :disabled="errors.email"
                    @click="createBot()"
                    class="btn btn-primary"
                  >
                    {{ $t('setting.createUser') }}
                  </button>
                </div>
              </div>
            </div>
            <div class="mb-10">
              <label for="user_id" class="form-label">
                {{ $t('setting.userId') }}
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
            </div>
            <div class="mb-10">
              <label for="user_type" class="form-label">
                {{ $t('setting.userType') }}
              </label>
              <v-select
                :options="userTypeList"
                option-value="id"
                option-label="name"
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
        {{ $t('setting.add') }}
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
  BOT_TYPE_ENUM,
} from '@/models/setting-exchange/BotSetting'
import Swal from 'sweetalert2'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { HttpStatus } from '@/core/variables/common.enum'
import { UserService } from '@/services/UserService'
import { plainToInstance } from 'class-transformer'

export default defineComponent({
  name: 'add-user-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: plainToInstance(BotSettingItem, {}, { exposeDefaultValues: true }),
      userTypeEnum: BOT_TYPE_ENUM,
      userBotAuth: [] as BotSettingItem[],
      userBotObm: [] as BotSettingItem[],
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
  mounted() {
    this.getUserBotAuth()
    this.getUserBotObm()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleSelect(item) {
      this.user.user_id = item.user_id || ''
    },
    async querySearch(queryString, cb) {
      const userAuth = this.user.email
        ? this.userBotAuth.filter((item) => {
            return item.email.indexOf(this.user.email) >= 0
          })
        : this.userBotAuth
      const userObm = this.user.email
        ? this.userBotObm.filter((item) => {
            return item.email.indexOf(this.user.email) >= 0
          })
        : this.userBotObm
      const dataNotInObm = userAuth.filter((item) => {
        return !userObm.find((el) => el.user_id == item.user_id)
      })
      cb(
        dataNotInObm.map((item) => {
          return {
            value: item.email,
            user_id: item.user_id,
          }
        }),
      )
    },
    async createBot() {
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to create email ${this.user.email}?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const user = await SettingExchangeService.createBotSetting({
            email: this.user.email,
          })
          if (user.status != HttpStatus.OK) {
            this.$toastr.error('create account bot error!')
            return
          }
          if (!user.data.success) {
            this.$toastr.error(
              'account bot is exist, change bot active feature for setup!',
            )
            return
          }
          this.user.user_id = user?.data?.data?.id
        }
      })
    },
    async submitForm() {
      const form = await (this.$refs.addUserForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to add bot?`,
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
            this.$toastr.error('create bot error!')
            return
          }
          this.$toastr.success('create bot success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
    },
    async getUserBotAuth() {
      const botList = await UserService.getListUsers({
        type: 2,
        per_page: 1000,
      })
      if (botList.status != HttpStatus.OK) {
        this.userBotAuth = []
        return
      }
      this.userBotAuth = botList.data?.data || []
    },
    async getUserBotObm() {
      const botObm = await SettingExchangeService.getBotList({
        per_page: 1000,
      })
      if (botObm.status != HttpStatus.OK) {
        this.userBotObm = []
        return
      }
      this.userBotObm = botObm.data?.data || []
    },
  },
})
</script>
