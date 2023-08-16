<template>
  <div
    class="modal fade"
    id="kt_modal_add_tags_for_users"
    ref="addTagsForUsersModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_tags_for_users_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('addTagsForUser') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_tags_for_users_close"
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
        <div class="p-5">
          <template v-if="userIds.length === 1">
            <div class="col-12 mb-5">
              <label class="form-label">{{ $t('currrentUserTags') }}:</label>
              <div class="text-gray">
                <strong v-if="currentUserTags && currentUserTags.length > 0">
                  {{ currentUserTags.join(', ') }}
                </strong>
                <small v-else>{{ $t('currentUserTagEmpty') }}</small>
              </div>
            </div>
            <div class="separator separator-dashed mb-7"></div>
          </template>

          <form class="mb-5" @submit="createNewTag">
            <div class="row">
              <div class="col-12">
                <label class="form-label">{{ $t('createNewTag') }}</label>
              </div>
              <div class="col-8">
                <input
                  v-model="newTagText"
                  type="text"
                  class="form-control"
                  placeholder="Enter new tag"
                  @input="newTagNotice = ''"
                  required
                  maxlength="255"
                />
              </div>
              <div class="col-4">
                <button type="submit" class="btn btn-success">
                  {{ $t('create') }}
                </button>
              </div>
              <div class="col-12">
                <small>{{ newTagNotice }}</small>
              </div>
            </div>
          </form>
          <div class="separator separator-dashed mb-7"></div>
          <div class="row">
            <div class="col-12">
              <div class="mb-2">
                <label class="form-label">{{ $t('inputTags') }}</label>
              </div>
              <multiselect
                ref="multiselect"
                v-model="tags"
                mode="tags"
                :placeholder="$t('searchTags')"
                :close-on-select="false"
                :filter-results="false"
                :min-chars="1"
                :delay="300"
                :searchable="true"
                label="label"
                track-by="label"
                :options="searchOptions"
              >
              </multiselect>
              <button
                class="btn btn-success col-12 mt-4"
                @click="addTagsForUsers"
                :disabled="tags.length === 0"
              >
                Add tags for {{ userIds.length }} user<tempate
                  v-if="userIds.length > 1"
                  >s</tempate
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
import Swal from 'sweetalert2'
import Multiselect from '@vueform/multiselect'
import { UserTagService } from '@/services/UserTagService'
import { HttpStatus } from '@/core/variables/common.enum'

export default {
  name: 'add-tags-for-users-modal',
  components: { Multiselect },
  props: {
    userIds: { type: Array },
    currentUserTags: { type: Array },
  },
  data() {
    return {
      newTagText: '',
      newTagNotice: '',
      tags: [],
    }
  },
  methods: {
    async addTagsForUsers() {
      await UserTagService.addTagsForUsers(this.userIds, this.tags)
      this.newTagNotice = ''
      this.newTagText = ''
      this.$refs.multiselect.clear()
      this.$refs.multiselect.clearSearch()

      this.beforeSave()
    },
    async createNewTag(e) {
      e.preventDefault()

      const response = await UserTagService.createOneTag(this.newTagText)
      if (response.status !== HttpStatus.CREATED) {
        this.newTagNotice = this.$t('failedAddedTagMsg')
        return
      }

      if (response.data.data.is_existed) {
        this.newTagNotice = this.$t('failedCreateExistedTag')
        return
      }

      this.newTagText = ''
      this.newTagNotice = this.$t('succeedAddedTagMsg')
      this.tags.push(response.data.data.id)
      this.$refs.multiselect.select({
        label: response.data.data.name,
        value: response.data.data.id,
      })
    },
    async searchOptions(text) {
      const response = await UserTagService.getListTags({
        search_field: 'name',
        search_text: text,
        sort: 'created_at',
        sort_type: 'DESC',
      })
      return response.data.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      })
    },
  },
  setup(props, { emit }) {
    const addTagsForUsersModalRef = ref(null)

    const close = () => {
      hideModal(addTagsForUsersModalRef.value)
    }

    const beforeSave = async () => {
      Swal.fire({
        text: 'Added tags for selected user(s)!',
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(async () => {
        emit('addedTagsToUsers')
        hideModal(addTagsForUsersModalRef.value)
      })
    }

    return {
      addTagsForUsersModalRef,
      beforeSave,
      close,
    }
  },
}
</script>
