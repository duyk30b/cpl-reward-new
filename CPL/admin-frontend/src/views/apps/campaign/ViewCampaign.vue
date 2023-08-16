<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid me-lg-15 order-2 order-lg-1 mb-10 mb-lg-0">
      <Details></Details>

      <Events></Events>

      <Invoices></Invoices>
    </div>
    <!--end::Content-->

    <!--begin::Sidebar-->
    <div
      class="flex-column flex-lg-row-auto w-lg-250px w-xl-300px mb-10 order-1 order-lg-2"
    >
      <Summary></Summary>
    </div>
    <!--end::Sidebar-->
  </div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Details from '@/components/campaigns/view/Details.vue'
import Events from '@/components/campaigns/view/Events.vue'
import Invoices from '@/components/campaigns/view/Invoices.vue'
import Summary from '@/components/campaigns/view/Summary.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'

export default defineComponent({
  name: 'kt-view-campaign',
  components: {
    Details,
    Events,
    Invoices,
    Summary,
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs('View Campaign', ['menu.marketingFunctions'])
    })
  },
})
</script>
