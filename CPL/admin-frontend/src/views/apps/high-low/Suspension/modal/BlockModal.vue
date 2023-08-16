<template>
  <div
    class="modal fade"
    id="kt_modal_block_user_modal"
    ref="blockUserModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_unlimited_user_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.blockUser') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_block_user_close"
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
          <label class="form-label">{{ $t('highLow.email') }}:</label>
          <v-select
            :options="options"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.placeHolderRegister')"
            v-model="dataUser.userSelected"
            searchable
            :can-deselect="true"
            @input="fetchOptions"
            @change="changeSelect"
            autocomplete
          >
          </v-select>
        </div>
        <div class="m-6">
          <CustomInput
            v-model="dataUser.userId"
            label="highLow.userId"
            textAlign="left"
            type="number"
            disabled
          />
        </div>
        <div class="m-6">
          <CustomInputText
            v-model="dataUser.reason"
            label="highLow.reason"
            textAlign="left"
            type="text"
            maxLength="255"
          />
        </div>
        <div class="m-6 text-center">
          <a
            class="btn btn-primary text-uppercase mt-4 px-16"
            @click="handleBlockUser"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin fa-fw"></i>
            {{ $t('submit') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from '@/components/form/CustomInput.vue'
import CustomInputText from '@/components/form/CustomInputText.vue'
import { hideModal } from '@/core/helpers/dom'
import { HighLowService } from '@/services/HighLowService'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'add-unlimited-user-modal',
  components: { CustomInput, CustomInputText },
  props: {
    dataModal: {
      type: Object,
      default: () => {
        return {
          userSelected: null,
          userId: '',
          reason: '',
        }
      },
    },
  },
  data() {
    return {
      dataUser: this.dataModal,
      isLoading: false,
      options: [],
      email: '',
    }
  },
  watch: {
    dataModal: {
      handler(newVal) {
        this.dataUser = newVal
      },
      immediate: true,
    },
  },
  computed: {
    query: function (): any {
      return {
        search_text: this.dataUser.userSelected || undefined,
      }
    },
  },
  setup(_, { emit }) {
    const blockUserModalRef = ref(null)

    const close = () => {
      hideModal(blockUserModalRef.value)
    }

    return {
      blockUserModalRef,
      close,
    }
  },
  methods: {
    async getUserVerify() {
      const response = await HighLowService.getUsersBalance({ ...this.query })
      if (response.status === 200) {
        this.options = response.data.data.map((item) => ({
          id: item.id,
          name: item.email,
        }))
      }
    },
    async handleBlockUser() {
      if (!this.dataUser.userSelected) {
        this.$toastr.error('The user field is required.')
        return
      }

      const temp: any = this.options.find(
        (item: any) => item.id === this.dataUser.userSelected,
      )
      this.isLoading = true
      const res = await HighLowService.addBlockedUser({
        userId: this.dataUser.userId,
        reason: this.dataUser.reason,
      })
      this.isLoading = false

      if (res.data['success']) {
        this.$toastr.success(
          this.$t('highLow.blockSuccess', { value: temp.name }),
        )
        this.dataUser.userSelected = null
        this.close()
        this.$emit('refreshTable')
      } else {
        this.$toastr.error(this.$t('highLow.blockFalse', { value: temp.name }))
      }
    },
    async fetchOptions(input) {
      if (input.inputType == 'deleteContentBackward') {
        this.email = this.email.slice(0, -1)
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

    changeSelect(data) {
      this.dataUser.userId = data
      this.email = ''
    },
  },
  mounted() {
    this.getUserVerify()
  },
})
</script>
