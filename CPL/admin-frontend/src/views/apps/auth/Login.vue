<template>
  <!--begin::Wrapper-->
  <div class="login-wrapper">
    <img class="logo" src="media/logos/logo-castle.png" alt="" />
    <Form @submit="login">
      <Field
        name="userId"
        v-model="userId"
        rules="required"
        v-slot="{ field, errorMessage }"
      >
        <div class="mb-6">
          <input
            type="text"
            class="login-input"
            :class="{ warning: errorMessage }"
            v-bind="field"
            :placeholder="$t('userId')"
          />
          <p class="message-warning" v-if="errorMessage">
            {{ $t(errorMessage, { name: $t('userId') }) }}
          </p>
        </div>
      </Field>
      <Field
        name="password"
        v-model="password"
        rules="required"
        v-slot="{ field, errorMessage }"
      >
        <div class="mb-6">
          <input
            type="password"
            class="login-input"
            :class="{ warning: errorMessage }"
            v-bind="field"
            :placeholder="$t('password')"
          />
          <p class="message-warning" v-if="errorMessage">
            {{ $t(errorMessage, { name: $t('password') }) }}
          </p>
        </div>
      </Field>
      <Field
        name="authenticatorCode"
        v-model="authenticatorCode"
        rules="required|digits:6"
        v-slot="{ field, errorMessage }"
      >
        <div class="mb-6">
          <input
            type="text"
            class="login-input"
            :class="{ warning: errorMessage }"
            v-bind="field"
            :placeholder="$t('twoStepVerification')"
            maxlength="6"
          />
          <p class="message-warning" v-if="errorMessage">
            {{
              $t(errorMessage, { name: $t('twoStepVerification'), length: 6 })
            }}
          </p>
        </div>
      </Field>
      <div v-if="errorMessage" class="mb-6 message-warning text-center">
        <p>{{ $t(errorMessage) }}</p>
      </div>
      <el-button
        class="btn-login"
        type="primary"
        native-type="submit"
        :loading="loading"
        >{{ $t('login') }}</el-button
      >
      <div class="mt-6 lang-picker">
        <span
          :class="{ active: currentLangugeLocale === 'en' }"
          @click="setLang('en')"
          >{{ $t('english') }}</span
        >
        <el-divider direction="vertical" class="lang-divider" />
        <span
          :class="{ active: currentLangugeLocale === 'ja' }"
          @click="setLang('ja')"
          >{{ $t('japan') }}</span
        >
      </div>
    </Form>

    <el-dialog
      v-model="showConfirmModal"
      append-to-body
      title=""
      width="460px"
      center
      @close="onCloseConfirmModal"
    >
      <div class="dialog-header">
        <p class="dialog-title mb-4 text-center">
          {{ $t('loginConfirmTitle') }}
        </p>
        <p class="text-center mb-4 title-annotation">
          {{ $t('loginConfirmAnnotation') }}
        </p>
      </div>

      <Form ref="verifyForm">
        <Field
          name="verifyCode"
          v-model="verifyCode"
          rules="required"
          v-slot="{ field, errorMessage }"
        >
          <div class="mb-6">
            <input
              type="text"
              class="verify-input"
              v-bind="field"
              :placeholder="$t('emailVerifyCode')"
            />
            <span v-if="errorMessage" class="message-error">
              {{ $t(errorMessage, { name: $t('emailVerifyCode') }) }}
            </span>
          </div>
        </Field>

        <Field
          name="secondAuthenticatorCode"
          v-model="secondAuthenticatorCode"
          rules="required|digits:6"
          v-slot="{ field, errorMessage }"
        >
          <div class="mb-6">
            <input
              type="text"
              class="verify-input"
              v-bind="field"
              :placeholder="$t('twoStepVerification')"
            />
            <span v-if="errorMessage" class="message-error">{{
              $t(errorMessage, { name: $t('twoStepVerification') })
            }}</span>
          </div>
        </Field>
      </Form>

      <template #footer>
        <div v-if="verifyErrorMessage" class="mb-6 message-error text-center">
          <p>{{ $t(verifyErrorMessage) }}</p>
        </div>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="verify"
            size="default"
            :loading="loading"
            >{{ $t('submit') }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Field, Form } from 'vee-validate'
import { Actions } from '@/store/enums/StoreEnums'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n/index'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'login',
  components: {
    Form,
    Field,
  },
  setup() {
    const store = useStore()
    const i18n = useI18n()
    const router = useRouter()

    i18n.locale.value = localStorage.getItem('lang')
      ? (localStorage.getItem('lang') as string)
      : 'en'

    const setLang = (lang) => {
      localStorage.setItem('lang', lang)
      i18n.locale.value = lang
    }

    const currentLangugeLocale = computed(() => {
      return i18n.locale.value
    })

    return {
      setLang,
      currentLangugeLocale,
      requestLogin: (params) => store.dispatch(Actions.LOGIN, params),
      requestVerifyLogin: (params) =>
        store.dispatch(Actions.VERIFY_LOGIN, params),
      redirectDashboard: () => router.push({ name: 'dashboard' }),
    }
  },
  data() {
    return {
      userId: '',
      password: '',
      authenticatorCode: '',
      showConfirmModal: false,
      errorMessage: '',
      verifyCode: '',
      secondAuthenticatorCode: '',
      verifyErrorMessage: '',
      loading: false,
    }
  },
  methods: {
    async login() {
      this.loading = true
      const res = await this.requestLogin({
        email: this.userId,
        password: this.password,
        otp: this.authenticatorCode,
        lang: this.currentLangugeLocale,
      })
      this.loading = false

      if (res.status === HttpStatus.OK) {
        this.showConfirmModal = true
        return
      }

      this.errorMessage = this.$t('authenticateFailed')
    },
    async verify() {
      const form = await (this.$refs.verifyForm as any).validate()
      if (!form.valid) {
        return
      }

      this.loading = true
      const res = await this.requestVerifyLogin({
        email: this.userId,
        token: this.verifyCode,
        otp: this.secondAuthenticatorCode,
      })
      this.loading = false

      if (res.status === HttpStatus.OK) {
        this.redirectDashboard()
        return
      }

      this.verifyErrorMessage = res.data.message
    },
    onCloseConfirmModal() {
      this.verifyErrorMessage = ''
      this.verifyCode = ''
      this.secondAuthenticatorCode = ''
      this.authenticatorCode = ''
    },
  },
})
</script>

<style lang="scss" scoped>
.login-wrapper {
  text-align: center;
}
.logo {
  width: 120px;
  margin-bottom: 50px;
}
.btn-login {
  width: 100%;
}
.error-message {
  color: #fdff00;
}
.lang-picker {
  color: #1ea1f2;

  .active {
    color: #fff;
  }
  span:hover {
    cursor: pointer;
  }
}
.dialog-header {
  margin-bottom: 30px;
}
.dialog-title {
  font-size: 25px;
  line-height: 29px;
  color: #1ea1f2;
  font-weight: 400;
}
.lang-divider {
  border-color: #1ea1f2;
}
.login-input {
  width: 100%;
  height: 50px;
  background: transparent;
  border: thin solid #6ea0d2;
  padding: 0 25px;
  color: #fff;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;

  &.warning {
    border: thin solid #fdff00 !important;
  }

  &:focus {
    background-color: #2671bc;
    border: thin solid #fff;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    outline: none;
  }

  &::placeholder {
    color: #fff;
  }

  &:-ms-input-placeholder {
    color: #fff;
  }

  &::-ms-input-placeholder {
    color: #fff;
  }
}
.message-warning {
  color: #fdff00;
  text-align: left;
}
.message-error {
  color: #d0021b;
}
.verify-input {
  width: 100%;
  height: 40px;
  padding: 10px;
  line-height: 20px;
  border: 1px solid #cfcfcf;
  font-size: 14px;
  color: #333;
  outline-offset: 0;
  outline: 0 auto -webkit-focus-ring-color;
}
.el-dialog__body {
  padding: 20px 50px 0px !important;
}
.el-dialog__footer {
  padding: 10px 50px 50px 50px;
}
.title-annotation {
  font-size: 13px;
}
</style>
