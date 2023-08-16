<template>
  <!--begin::Toolbar-->
  <div class="toolbar" id="kt_toolbar">
    <!--begin::Container-->
    <div
      id="kt_toolbar_container"
      :class="{
        'container-fluid': toolbarWidthFluid,
        'container-xxl': !toolbarWidthFluid,
      }"
      class="d-flex flex-stack"
    >
      <!--begin::Page title-->
      <div
        data-kt-swapper="true"
        data-kt-swapper-mode="prepend"
        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
        class="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0"
      >
        <!--begin::Title-->
        <h1
          class="d-flex align-items-center text-dark fw-bolder my-1 fs-3"
          v-if="title"
        >
          {{ $t(title) }}
        </h1>
        <!--end::Title-->

        <span
          v-if="breadcrumbs"
          class="h-20px border-gray-200 border-start mx-4"
        ></span>

        <!--begin::Breadcrumb-->
        <ul
          v-if="breadcrumbs"
          class="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1"
        >
          <li class="breadcrumb-item pe-3">
            <router-link to="/dashboard" class="text-muted text-hover-primary">
              {{ $t('home') }}
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <span class="bullet bg-gray-200 w-5px h-2px"></span>
          </li>
          <template v-for="(item, index) in breadcrumbs" :key="index">
            <li class="breadcrumb-item text-muted">
              {{ $t(item) }}
            </li>
            <li class="breadcrumb-item">
              <span class="bullet bg-gray-200 w-5px h-2px"></span>
            </li>
          </template>
          <li class="breadcrumb-item pe-3 text-dark">
            {{ $t(title) }}
          </li>
        </ul>
        <!--end::Breadcrumb-->
      </div>
      <!--end::Page title-->

      <!--begin::Actions-->
      <div class="d-none align-items-center py-1 d-lg-flex">
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
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Toolbar-->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { toolbarWidthFluid } from '@/core/helpers/config'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import KTUserMenu from '@/layout/header/partials/UserMenu.vue'

export default defineComponent({
  name: 'KToolbar',
  components: {
    KTUserMenu,
  },
  props: {
    breadcrumbs: Array,
    title: String,
  },
  setup() {
    const store = useStore()

    return {
      toolbarWidthFluid,
      logout: () => store.dispatch(Actions.LOGOUT),
    }
  },
})
</script>
