<template>
  <Form @submit="submit" ref="formEl">
    <base-modal
      title="updateUserInfo"
      :show="show"
      @close="close"
      dialogClass="modal-xl"
    >
      <template v-slot:body>
        <div
          v-if="loading.userInfo || loading.userKyc"
          class="text-center py-4"
        >
          <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
        </div>
        <template v-else>
          <Field
            v-if="userKyc"
            v-model="form.idDocumentNo"
            type="text"
            name="idDocumentNo"
            v-slot="{ field, errorMessage }"
            :rules="`required`"
          >
            <div class="form-group">
              <label class="required">{{ $t('idDocumentNo') }}</label>
              <input type="text" class="form-control" v-bind="field" />
              <error-display :message="errorMessage"></error-display>
            </div>
          </Field>
          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.firstName"
                type="text"
                name="firstName"
                v-slot="{ field, errorMessage }"
                :rules="`required`"
              >
                <div class="form-group">
                  <label class="required">{{ $t('firstName') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <Field
                v-model="form.lastName"
                type="text"
                name="lastName"
                v-slot="{ field, errorMessage }"
                :rules="`required`"
              >
                <div class="form-group">
                  <label class="required">{{ $t('lastName') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
          </div>

          <div class="form-group" v-if="form.nationalityId == JAPAN_ID">
            <label class="required">{{ $t('furigana') }}</label>
            <div class="row">
              <div class="col-md-6">
                <Field
                  v-model="form.furigana1"
                  type="text"
                  name="furigana1"
                  v-slot="{ field, errorMessage }"
                  :rules="`required`"
                >
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </Field>
              </div>
              <div class="col-md-6">
                <Field
                  v-model="form.furigana2"
                  type="text"
                  name="furigana2"
                  v-slot="{ field, errorMessage }"
                  :rules="`required`"
                >
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </Field>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.birthday"
                name="birthday"
                v-slot="{ handleChange, value, field, errorMessage }"
                :rules="`required`"
              >
                <div class="form-group">
                  <label class="required">{{ $t('birthday') }}</label>
                  <date-picker
                    v-bind="field"
                    :modelValue="value"
                    @update:modelValue="handleChange"
                    outputFormat="YYYY-MM-DD"
                  ></date-picker>
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <Field
                v-model="form.gender"
                name="gender"
                v-slot="{ handleChange, value, field, errorMessage }"
                rules="required"
              >
                <label class="required">{{ $t('gender') }}</label>
                <v-select
                  :options="genders"
                  option-value="id"
                  option-label="name"
                  :placeholder="$t('gender')"
                  :can-deselect="false"
                  v-bind="field"
                  :modelValue="value"
                  @update:modelValue="handleChange"
                >
                </v-select>
                <error-display :message="errorMessage"></error-display>
              </Field>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.nationalityId"
                name="nationalityId"
                v-slot="{ handleChange, value, field, errorMessage }"
                rules="required"
              >
                <div class="form-group">
                  <label class="required">{{ $t('nationality') }}</label>
                  <v-select
                    :options="getAllCountries()"
                    option-value="id"
                    option-label="name"
                    :placeholder="$t('nationality')"
                    :can-deselect="false"
                    v-bind="field"
                    :modelValue="value"
                    @update:modelValue="handleChange"
                  >
                  </v-select>
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <Field
                v-model="form.countryId"
                name="countryId"
                v-slot="{ handleChange, value, field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('country') }}</label>
                  <v-select
                    :options="getAllCountries()"
                    option-value="id"
                    option-label="name"
                    :placeholder="$t('country')"
                    v-bind="field"
                    :modelValue="value"
                    @update:modelValue="handleChange"
                  >
                  </v-select>
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.buildingRoom"
                type="text"
                name="buildingRoom"
                v-slot="{ field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('buildingRoom') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <Field
                v-model="form.address"
                type="text"
                name="address"
                v-slot="{ field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('address') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.city"
                type="text"
                name="city"
                v-slot="{ field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('city') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <Field
                v-model="form.stateRegion"
                type="text"
                name="stateRegion"
                v-slot="{ field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('stateRegion') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <Field
                v-model="form.zipCode"
                type="text"
                name="zipCode"
                v-slot="{ field, errorMessage }"
              >
                <div class="form-group">
                  <label>{{ $t('zipCode') }}</label>
                  <input class="form-control" v-bind="field" />
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>{{ $t('phoneNumber') }}</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend me-2">
                    <el-select
                      v-model="form.phoneCountry"
                      placeholder="Code"
                      filterable
                    >
                      <el-option
                        v-for="country in getAllCountries()"
                        :key="country.id"
                        :label="`${country.name} +${country.code}`"
                        :value="country.code"
                      >
                        {{ country.name }}
                        <b style="float: right">+{{ country.code }}</b>
                      </el-option>
                    </el-select>
                  </div>
                  <Field
                    v-model="form.phone"
                    type="text"
                    name="phone"
                    v-slot="{ field }"
                  >
                    <input class="form-control" v-bind="field" />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-primary me-2"
          type="submit"
          :disabled="loading.submit"
        >
          {{ $t('submit') }}
        </button>
        <button class="btn btn-secondary" type="button" @click="close">
          {{ $t('cancel') }}
        </button>
      </template>
    </base-modal>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserInfoService } from '@/services/UserInfoService'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import {
  formatServerErrors,
  getAllCountries,
  getEnumValues,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import { Gender, UpdateUserInfoDto, UserInfo } from '@/models/user/UserInfo'
import { UserKyc } from '@/models/user/UserKyc'
import { UserKycService } from '@/services/UserKycService'
import { plainToInstance } from 'class-transformer'
import CONFIG from '@/config'

export default defineComponent({
  components: { Form, Field, ErrorDisplay, BaseModal },
  props: {
    show: Boolean,
    userId: {
      type: String,
      required: true,
    },
  },
  watch: {
    userId: {
      handler() {
        this.getData()
      },
      immediate: true,
    },
  },
  data() {
    return {
      form: new UpdateUserInfoDto(),
      userInfo: null as Optional<UserInfo>,
      userKyc: null as Optional<UserKyc>,
      loading: {
        userInfo: false,
        userKyc: false,
        submit: false,
      },
      JAPAN_ID: CONFIG.JAPAN_ID,
      genders: getEnumValues(Gender).map((gender) => ({
        id: gender,
        name: this.$t(`genderValue.${gender}`),
      })),
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async submit() {
      this.loading.submit = true
      const res = await UserInfoService.update(this.userId, this.form)
      if (res?.success) {
        this.$toastr.success(this.$t('success'))
        this.close()
        this.$emit('infoUpdated')
      } else {
        this.$toastr.error(this.$t(res?.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
      this.loading.submit = false
    },
    async getData() {
      if (!this.userId) return
      await Promise.all([this.getUserInfo(), this.getUserKyc()])
      if (!this.userInfo) this.close()
      this.form = plainToInstance(UpdateUserInfoDto, this.userInfo, {
        ignoreDecorators: true,
      })
      this.form.idDocumentNo = this.userKyc?.idDocumentNo
    },
    async getUserInfo() {
      this.userInfo = await UserInfoService.findByUserId(this.userId)
    },
    async getUserKyc() {
      this.userKyc = await UserKycService.findKycByUserId(this.userId)
    },
    getAllCountries,
  },
})
</script>
