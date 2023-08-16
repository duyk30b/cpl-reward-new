<template>
  <div>
    <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
      <li class="nav-item">
        <a
          class="nav-link active"
          data-bs-toggle="tab"
          href="#tab_pane_orders"
          >{{ $t('highLow.orders') }}</a
        >
      </li>

      <!-- <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab_pane_transfer">{{
          $t('highLow.transfer')
        }}</a>
      </li> -->

      <li class="nav-item">
        <a
          class="nav-link"
          data-bs-toggle="tab"
          href="#tab_pane_transfer_major"
          >{{ $t('highLow.transferMajor') }}</a
        >
      </li>
    </ul>

    <div class="tab-content" id="tabContent">
      <div
        class="tab-pane fade show active"
        id="tab_pane_orders"
        role="tabpanel"
      >
        <Orders />
      </div>

      <!-- <div class="tab-pane fade" id="tab_pane_transfer" role="tabpanel">
        <Transfer />
      </div> -->

      <div class="tab-pane fade" id="tab_pane_transfer_major" role="tabpanel">
        <TransferMajor />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { defineComponent } from 'vue'
import Orders from './Orders.vue'
// import Transfer from './Transfer.vue'
import TransferMajor from './TransferMajor.vue'

export default defineComponent({
  name: 'history',
  components: {
    Orders,
    // Transfer,
    TransferMajor,
  },
  async mounted() {
    setCurrentPageBreadcrumbs('highLow.history', ['highLow.highLow'])
  },
  data() {
    return {}
  },
  methods: {},
})
</script>
