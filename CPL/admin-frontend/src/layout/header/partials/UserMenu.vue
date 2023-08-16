<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" src="media/avatars/300-1.jpg" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column user-info">
          <div
            class="fw-bolder align-items-center fs-5 line-clamp-1"
            :title="currentUser.email"
          >
            {{ currentUser.email }}
          </div>
          <span class="fw-bold text-muted text-hover-primary fs-7">
            {{ currentUser.name }}
          </span>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <div class="menu-item px-5">
      <router-link :to="{ name: 'profile' }" class="menu-link px-5">{{
        $t('profile')
      }}</router-link>
    </div>

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <span class="menu-link px-5">
        <span class="menu-title position-relative">
          {{ $t('language') }}
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ currentLangugeLocale.name }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="currentLangugeLocale.flag"
              alt="metronic"
            />
          </span>
        </span>
      </span>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <span
            @click="setLang('en')"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage('en') }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                src="media/flags/united-states.svg"
                alt="metronic"
              />
            </span>
            {{ $t('english') }}
          </span>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <span
            @click="setLang('ja')"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage('ja') }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                src="media/flags/japan.svg"
                alt="metronic"
              />
            </span>
            {{ $t('japan') }}
          </span>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="logout()" class="menu-link px-5">{{ $t('logout') }}</a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n/index'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'kt-user-menu',
  components: {},
  setup() {
    const i18n = useI18n()
    const store = useStore()

    i18n.locale.value = localStorage.getItem('lang')
      ? (localStorage.getItem('lang') as string)
      : 'en'

    const countries = {
      en: {
        flag: 'media/flags/united-states.svg',
        name: 'English',
      },
      ja: {
        flag: 'media/flags/japan.svg',
        name: 'Japanese',
      },
    }

    const setLang = (lang) => {
      localStorage.setItem('lang', lang)
      i18n.locale.value = lang
    }

    const currentLanguage = (lang) => {
      return i18n.locale.value === lang
    }

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value]
    })

    const currentUser = computed(() => {
      return store.getters.currentUser
    })

    return {
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      logout: () => store.dispatch(Actions.LOGOUT),
      currentUser,
    }
  },
})
</script>

<style lang="scss">
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.user-info {
  width: calc(100% - 55px);
}
</style>
