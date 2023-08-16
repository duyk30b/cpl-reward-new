<template>
  <div
    class="modal fade"
    id="kt_modal_register"
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
          <h2 class="fw-bolder">{{ $t('highLow.registerUnlimitedUser') }}</h2>
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
        <div class="m-6">
          <v-select
            :options="options"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.placeHolderRegister')"
            v-model="userSelected"
            searchable
            :can-deselect="true"
          >
          </v-select>

          <div class="text-center">
            <a
              class="btn btn-primary text-uppercase mt-4 px-16"
              @click="handleRegisterUser"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_register"
            >
              {{ $t('submit') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { hideModal } from '@/core/helpers/dom'
import Swal from 'sweetalert2'
import { HighLowService } from '@/services/HighLowService'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'add-campaign-modal',
  data() {
    return {
      addCampaignModalRef: null,
      userSelected: null,
      options: [],
    }
  },
  computed: {
    query: function (): any {
      return {
        search_text: this.userSelected || undefined,
      }
    },
  },
  methods: {
    async getUserVerify() {
      const response = await HighLowService.getUserVerified({ ...this.query })
      if (response.status === 200) {
        this.options = response.data.data.map((item) => ({
          id: item.id,
          name: item.email,
        }))
      }
    },
    close() {
      hideModal(this.addCampaignModalRef)
    },
    async handleSave(campaign) {
      Swal.fire({
        text: 'Campaign created!',
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(async () => {
        hideModal(this.addCampaignModalRef)
        await this.$router.push({
          name: 'campaign-detail',
          params: { id: campaign.id },
        })
      })
    },
    async handleRegisterUser() {
      const temp: any = this.options.find(
        (item: any) => item.id === this.userSelected,
      )

      const res = await HighLowService.registerUser({
        userId: temp?.id,
        email: temp?.name,
      })

      if (res.data['success']) {
        Swal.fire({
          text: 'User registered!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(async () => {
          this.userSelected = null
          this.$emit('refreshTable')
        })
      }
    },
  },
  mounted() {
    this.getUserVerify()
  },
})
</script>
