<template>
  <div
    class="modal fade"
    id="kt_modal_add_campaign"
    ref="addCampaignModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_campaign_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('createCampaign') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_campaign_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <CampaignSummary @saved="handleSave"></CampaignSummary>
      </div>
    </div>
  </div>
</template>
<script>
import CampaignSummary from '@/components/campaigns/add/CampaignSummary'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { hideModal } from '@/core/helpers/dom'
import Swal from 'sweetalert2'

export default {
  name: 'add-campaign-modal',
  components: { CampaignSummary },
  setup() {
    const router = useRouter()
    const addCampaignModalRef = ref(null)

    const close = () => {
      hideModal(addCampaignModalRef.value)
    }

    const handleSave = async (campaign) => {
      Swal.fire({
        text: 'Campaign created!',
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(async () => {
        hideModal(addCampaignModalRef.value)
        await router.push({
          name: 'campaign.detail',
          params: { id: campaign.id },
        })
      })
    }

    return {
      addCampaignModalRef,
      handleSave,
      close,
    }
  },
}
</script>
