<template>
  <KTLoader v-if="loaderEnabled" :logo="loaderLogo" />

  <!-- begin:: Body -->
  <div class="page d-flex flex-row flex-column-fluid">
    <!-- begin:: Aside Left -->
    <KTAside
      v-if="asideEnabled"
      :lightLogo="themeLightLogo"
      :darkLogo="themeDarkLogo"
    />
    <!-- end:: Aside Left -->

    <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
      <KTHeader :title="pageTitle" />

      <!-- begin:: Content -->
      <div
        id="kt_content"
        class="content d-flex flex-column flex-column-fluid position-relative"
      >
        <div class="page-loading" v-if="isApiLoading">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <!-- begin:: Content Head -->
        <KTToolbar
          v-if="subheaderDisplay"
          :breadcrumbs="breadcrumbs"
          :title="pageTitle"
        />
        <!-- end:: Content Head -->

        <!-- begin:: Content Body -->
        <div class="post d-flex flex-column-fluid">
          <div
            id="kt_content_container"
            :class="{
              'container-fluid': contentWidthFluid,
              'container-xxl': !contentWidthFluid,
            }"
          >
            <router-view />
          </div>
        </div>
        <!-- end:: Content Body -->
      </div>
      <!-- end:: Content -->
      <KTFooter />
    </div>
  </div>
  <!-- end:: Body -->
  <KTScrollTop />
  <KTDrawerMessenger />
  <KTUserMenu />
  <KTCreateApp />
  <KTDemosDrawer />
  <KTHelpDrawer />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import KTAside from '@/layout/aside/Aside.vue'
import KTHeader from '@/layout/header/Header.vue'
import KTFooter from '@/layout/footer/Footer.vue'
import HtmlClass from '@/core/services/LayoutService'
import KTToolbar from '@/layout/toolbar/Toolbar.vue'
import KTScrollTop from '@/layout/extras/ScrollTop.vue'
import KTUserMenu from '@/layout/header/partials/ActivityDrawer.vue'
import KTLoader from '@/components/Loader.vue'
import KTCreateApp from '@/components/modals/wizards/CreateAppModal.vue'
import KTDemosDrawer from '@/layout/extras/DemosDrawer.vue'
import KTHelpDrawer from '@/layout/extras/HelpDrawer.vue'
import KTDrawerMessenger from '@/layout/extras/MessengerDrawer.vue'
import { Actions } from '@/store/enums/StoreEnums'
import { MenuComponent } from '@/assets/ts/components'
import { removeModalBackdrop } from '@/core/helpers/dom'
import { reinitializeComponents } from '@/core/plugins/keenthemes'
import {
  toolbarDisplay,
  loaderEnabled,
  contentWidthFluid,
  loaderLogo,
  asideEnabled,
  subheaderDisplay,
  themeLightLogo,
  themeDarkLogo,
} from '@/core/helpers/config'
import { Permission } from '@/core/variables/common.enum'
import { checkPermission } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'Layout',
  components: {
    KTAside,
    KTHeader,
    KTFooter,
    KTToolbar,
    KTScrollTop,
    KTCreateApp,
    KTUserMenu,
    KTDemosDrawer,
    KTHelpDrawer,
    KTDrawerMessenger,
    KTLoader,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // show page loading
    store.dispatch(Actions.ADD_BODY_CLASSNAME, 'page-loading')

    // Get all common setting
    store.dispatch(Actions.FETCH_MASTERDATA)

    // Get count of missing reward
    if (checkPermission(Permission.REWARD_LOG_COUNT)) {
      store.dispatch(Actions.FETCH_MISSING_REWARDS_COUNT)
    }

    // initialize html element classes
    HtmlClass.init()

    const pageTitle = computed(() => {
      return store.getters.pageTitle
    })

    const breadcrumbs = computed(() => {
      return store.getters.pageBreadcrumbPath
    })

    const isApiLoading = computed(() => {
      return store.getters.isApiLoading
    })

    onMounted(() => {
      //check if current user is authenticated
      if (!store.getters.isUserAuthenticated) {
        router.push({ name: 'login' })
      }

      nextTick(() => {
        reinitializeComponents()
      })

      // Simulate the delay page loading
      setTimeout(() => {
        // Remove page loader after some time
        store.dispatch(Actions.REMOVE_BODY_CLASSNAME, 'page-loading')
      }, 500)
    })

    watch(
      () => route.path,
      () => {
        MenuComponent.hideDropdowns(undefined)

        // check if current user is authenticated
        if (!store.getters.isUserAuthenticated) {
          router.push({ name: 'login' })
        }

        nextTick(() => {
          reinitializeComponents()
        })
        removeModalBackdrop()
      },
    )

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      pageTitle,
      breadcrumbs,
      themeLightLogo,
      themeDarkLogo,
      isApiLoading,
    }
  },
})
</script>
<style lang="scss" scoped>
.page-loading {
  position: absolute;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.9);
  color: #444;
  font-size: 2em;

  i {
    font-size: 1.3em;
  }
}
</style>
