<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex align-items-stretch flex-shrink-0">
    <!--begin::Search-->
    <!-- <div class="d-flex align-items-stretch ms-1 ms-lg-3">
      <KTSearch></KTSearch>
    </div> -->
    <!--end::Search-->

    <!--begin::Activities-->
    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        id="kt_activities_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen032.svg" />
        </span>
      </div>
    </div> -->
    <!--end::Activities-->

    <!--begin::Quick links-->
    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen025.svg" />
        </span>
      </div>
      <KTQuickLinksMenu></KTQuickLinksMenu>
    </div> -->
    <!--end::Quick links-->

    <!--begin::Chat-->
    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        id="kt_drawer_chat_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/communication/com012.svg" />
        </span>

        <span
          class="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"
        >
        </span>
      </div>
    </div> -->
    <!--end::Chat-->

    <!--begin::Notifications-->
    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen022.svg" />
        </span>
      </div>
      <KTNotificationsMenu></KTNotificationsMenu>
    </div> -->
    <!--end::Notifications-->

    <!--begin::User-->
    <div
      class="d-flex align-items-center ms-1 ms-lg-3"
      id="kt_header_user_menu_toggle"
    >
      <div
        class="cursor-pointer symbol symbol-30px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <img src="media/avatars/300-1.jpg" alt="metronic" />
      </div>
      <KTUserMenu></KTUserMenu>
    </div>
    <!--end::User -->

    <!--begin::Heaeder menu toggle-->
    <!-- <div
      class="d-flex align-items-center d-lg-none ms-2 me-n3"
      title="Show header menu"
    >
      <div
        class="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px"
        id="kt_header_menu_mobile_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/text/txt001.svg" />
        </span>
      </div>
    </div> -->
    <!--end::Heaeder menu toggle-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KTUserMenu from '@/layout/header/partials/UserMenu.vue'

export default defineComponent({
  name: 'topbar',
  components: {
    KTUserMenu,
  },
})
</script>
