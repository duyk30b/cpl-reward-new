<template>
  <div class="modal show d-block">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_unlimited_user_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.registerUnlimitedUser') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            @click="onClickClose"
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
            @input="fetchOptions"
            @change="changeSelect"
            autocomplete
          >
          </v-select>

          <div class="text-center">
            <a
              class="btn btn-primary text-uppercase mt-4 px-16"
              @click="handleRegisterUser"
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
  name: 'add-unlimited-user-modal',
  data() {
    return {
      addUnlimitedUserModalRef: null,
      userSelected: null,
      options: [],
      email: ''
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
    onClickClose() {
      this.$emit('onClickClose')
    },
    async getUserVerify() {
      const response = await HighLowService.getUsersBalance({ ...this.query })
      if (response.status === 200) {
        this.options = response.data.data.map((item) => ({
          id: item.id,
          name: item.email,
        }))
      }
    },
    close() {
      hideModal(this.addUnlimitedUserModalRef)
    },
    async handleRegisterUser() {
      if (!this.userSelected) {
        this.$toastr.error('The unlimit user field is required.')
        return
      }

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
          this.onClickClose()
          this.$emit('refreshTable')
        })
      }
    },
    async fetchOptions (input) {
      console.log(input)
      if (input.inputType == 'deleteContentBackward') {
        this.email = this.email.slice(0, -1);
      } else {
        const keyword = input.data
        this.email = this.email + keyword
      }

      this.query.search_text = this.email

      const response = await HighLowService.getUsersBalance({ ...this.query })

      const data = response.data.data
      if (data.length > 0) {
        const temp = data.map((item) => ({
          id: item.id,
          name: item.email,
        }))

        this.options = temp
      }

      return this.options
    },

    changeSelect () {
      this.email = ''
    }
  },
  mounted() {
    this.getUserVerify()
  },
})
</script>
