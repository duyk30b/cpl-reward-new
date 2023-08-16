<template>
  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y my-5 my-lg-5"
    data-kt-scroll="true"
    data-kt-scroll-activate="{default: false, lg: true}"
    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
    data-kt-scroll-height="auto"
    data-kt-scroll-offset="0"
    data-kt-scroll-wrappers="#kt_aside_menu"
  >
    <!--begin::Menu-->
    <div
      id="#kt_header_menu"
      class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
      data-kt-menu="true"
    >
      <template v-for="(item, i) in MainMenuConfig" :key="i">
        <div v-if="item.heading" class="menu-item">
          <div class="menu-content pt-8 pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">
              {{ translate(item.heading) }}
            </span>
          </div>
        </div>
        <template v-for="(menuItem, j) in item.pages" :key="j">
          <template v-if="menuItem.heading">
            <div class="menu-item">
              <router-link
                class="menu-link"
                active-class="active"
                :to="menuItem.route"
                v-if="checkDisplay(menuItem)"
              >
                <span v-if="hasIcon(menuItem)" class="menu-icon">
                  <i
                    v-if="menuItem.fwIcon"
                    :class="menuItem.fwIcon"
                    class="fs-3"
                  ></i>
                  <i
                    v-else-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{
                  translate(menuItem.heading)
                }}</span>
                <span v-if="menuItem.notification" class="badge badge-danger">{{
                  getters[menu.notification]
                }}</span>
              </router-link>
            </div>
          </template>
          <div
            v-if="menuItem.sectionTitle && checkDisplay(menuItem)"
            :class="{ show: hasActiveChildren(menuItem.sub) }"
            class="menu-item menu-accordion"
            data-kt-menu-sub="accordion"
            data-kt-menu-trigger="click"
          >
            <span class="menu-link">
              <span v-if="hasIcon(menuItem)" class="menu-icon">
                <i
                  v-if="menuItem.fwIcon"
                  :class="menuItem.fwIcon"
                  class="fs-3"
                ></i>
                <i
                  v-else-if="asideMenuIcons === 'font'"
                  :class="menuItem.fontIcon"
                  class="bi fs-3"
                ></i>
                <span
                  v-else-if="asideMenuIcons === 'svg'"
                  class="svg-icon svg-icon-2"
                >
                  <inline-svg :src="menuItem.svgIcon" />
                </span>
              </span>
              <span class="menu-title">{{
                translate(menuItem.sectionTitle)
              }}</span>
              <span class="menu-arrow"></span>
            </span>
            <div
              :class="{ show: hasActiveChildren(menuItem.sub) }"
              class="menu-sub menu-sub-accordion"
            >
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <div
                  v-if="item2.heading && checkDisplay(item2)"
                  class="menu-item"
                >
                  <router-link
                    class="menu-link"
                    active-class="active"
                    :to="item2.route"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.heading)
                    }}</span>
                    <span
                      v-if="item2.notification"
                      class="badge badge-danger"
                      >{{ getters[item2.notification] }}</span
                    >
                  </router-link>
                </div>
                <div
                  v-if="item2.sectionTitle && checkDisplay(item2)"
                  :class="{ show: hasActiveChildren(item2.sub) }"
                  class="menu-item menu-accordion"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link">
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.sectionTitle)
                    }}</span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    :class="{ show: hasActiveChildren(item2.sub) }"
                    class="menu-sub menu-sub-accordion"
                  >
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <div
                        v-if="item3.heading && checkDisplay(item3)"
                        class="menu-item"
                      >
                        <router-link
                          :class="{
                            active: hasActiveChildren([item3]),
                          }"
                          class="menu-link"
                          exact-active-class="active"
                          :to="item3.route"
                        >
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(item3.heading)
                          }}</span>
                          <span
                            v-if="item3.notification"
                            class="badge badge-danger"
                            >{{ getters[item3.notification] }}</span
                          >
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
      <div class="menu-item">
        <div class="menu-content">
          <div class="separator mx-1 my-4"></div>
        </div>
      </div>
    </div>
    <!--end::Menu-->
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n/index.js'
import { useRoute } from 'vue-router'
import { version } from '@/core/helpers/documentation'
import { asideMenuIcons } from '@/core/helpers/config'
import MainMenuConfig from '@/core/config/MainMenuConfig'
import { useStore } from 'vuex'
import { checkScreen, hasAllPermissions } from '@/core/helpers/common.helper'
import CONFIG from '@/config'

export default defineComponent({
  name: 'kt-menu',
  components: {},
  setup() {
    const { t, te } = useI18n()
    const route = useRoute()
    const scrollElRef = ref<null | HTMLElement>(null)
    const store = useStore()

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0
      }
    })

    const translate = (text) => {
      if (te(text)) {
        return t(text)
      } else {
        return text
      }
    }

    const hasActiveChildren = (items) => {
      const menuItems = items ? items : []

      return menuItems.find((menu) => {
        if (menu.route === route.path || route.path.includes(menu.route)) {
          return true
        }

        if (menu.sub && menu.sub.length) {
          return hasActiveChildren(menu.sub)
        }

        return false
      })
    }

    return {
      hasActiveChildren,
      MainMenuConfig,
      asideMenuIcons,
      version,
      translate,
      getters: store.getters,
    }
  },
  methods: {
    checkDisplay: function (menu) {
      if (menu.sub) return menu.sub.some((sub) => this.checkDisplay(sub))
      if (menu.public) return true

      const route = this.$router.resolve(menu.route)
      if (!route) {
        return false
      }

      /**
       * TODO: invisible future screen on production
       * Author: TuanCM
       */
      if (
        ['production'].includes(CONFIG.APP_ENV) &&
        menu.showOnProd !== undefined &&
        !menu.showOnProd
      )
        return false

      if (!Object.keys(route.meta).includes('permissions')) return false
      if (!Object.keys(route.meta).includes('screen')) return false

      const permissions = route.meta['permissions'] as number[]
      const screen = route.meta['screen'] as number
      return hasAllPermissions(permissions) && checkScreen(screen)
    },
    hasIcon(menu) {
      return menu.fwIcon || menu.svgIcon || menu.fontIcon
    },
  },
})
</script>
