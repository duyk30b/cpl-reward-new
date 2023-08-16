<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.userTag') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable
        :config="tableConfig"
        @checkAll="handleCheckAll"
        :force-reload-key="reloadKey"
        ref="userTagTable"
      >
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center"
            data-kt-user-table-toolbar="selected"
          >
            <div class="fw-bolder me-5">
              <span class="me-2" data-kt-user-table-select="selected_count">
                {{ checkedUsers.length }}
              </span>
              {{ $t('selected') }}
            </div>
            <button
              type="button"
              class="btn btn-success me-2"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_add_tags_for_users"
              :disabled="checkedUsers.length === 0"
              ref="atags"
            >
              {{ $t('addTags') }}
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="checkedUsers.length === 0"
              @click="deleteAllTags"
            >
              {{ $t('deleteTags') }}
            </button>
          </div>
        </template>
        <template v-slot:cell-checkbox="{ row: user }">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="user.user_id"
              data-kt-user-tag="check"
              v-model="checkedUsers"
            />
          </div>
        </template>
        <template v-slot:cell-action="{ row: user }">
          <!--          <router-link-->
          <!--            :to="{ name: 'user.detail', params: { id: user.user_id } }"-->
          <!--            class="btn btn-sm btn-flex btn-light-primary me-1 mb-1"-->
          <!--          >-->
          <!--            <span class="svg-icon svg-icon-3">-->
          <!--              <inline-svg src="/media/icons/duotune/general/gen016.svg" />-->
          <!--            </span>-->
          <!--          </router-link>-->

          <a
            class="btn btn-sm btn-primary me-1"
            :href="`${CONFIG.ADMIN_V2_URL}admin/users/user-info-registrant/${user.user_id}/view`"
            target="_blank"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/general/gen016.svg" />
            </span>
          </a>

          <button
            @click="addTagsSingleUser(user.user_id, user.tags)"
            class="btn btn-sm btn-flex btn-light-success me-1 mb-1"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/general/gen041.svg" />
            </span>
          </button>

          <button
            :disabled="!user.tags"
            :class="!user.tags ? 'opacity-25' : ''"
            @click="deleteTagsSingleUser(user.user_id)"
            class="btn btn-sm btn-flex btn-light-danger"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen040.svg" />
            </span>
          </button>
        </template>
      </datatable>
    </div>
  </div>
  <AddTagsForUsersModal
    :currentUserTags="currentUserTags"
    :user-ids="checkedUsers"
    @addedTagsToUsers="refreshDatatable"
  ></AddTagsForUsersModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  checkPermission,
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import Swal from 'sweetalert2'
import AddTagsForUsersModal from '@/components/user-tag/AddTagsForUsersModal.vue'
import { UserTagService } from '@/services/UserTagService'
import { showModal } from '@/core/helpers/dom'
import CONFIG from '@/config'
import { Permission } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'list-user-tag',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.userTag', ['menu.marketingFunctions'])
  },
  components: {
    AddTagsForUsersModal,
    Datatable,
  },
  methods: {
    addTagsSingleUser(userId, userTags) {
      this.checkedUsers = [userId]
      this.currentUserTags = userTags
      setTimeout(() => {
        if (this.$refs.atags) {
          ;(this.$refs.atags as any).click()
        }
      }, 200)
    },
    deleteTagsSingleUser(userId) {
      this.checkedUsers = [userId]
      this.deleteAllTags()
    },
    refreshDatatable() {
      if (this.$refs.userTagTable) {
        ;(this.$refs.userTagTable as IDatatableContext).getData()
      }
    },
    deleteAllTags() {
      Swal.fire({
        text: 'Do you want to delete tags of selected user(s)? This action CANNOT be undone!',
        icon: 'warning',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: 'Ok, let do it!',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await UserTagService.deleteTagsByUsers(this.checkedUsers)
          this.refreshDatatable()
        }
      })
    },
    handleCheckAll(data) {
      if (!data.checked) {
        this.checkedUsers = data.ids
      } else {
        this.checkedUsers = []
      }
    },
  },
  data() {
    return {
      CONFIG,
      currentUserTags: [],
      reloadKey: 0,
      checkedUsers: [] as number[],
      tableConfig: {
        identifyField: 'user_id',
        dataSource: (params) => UserTagService.getListUserTags(params),
        columns: [
          {
            key: 'checkbox',
            title: '',
            sortable: false,
          },
          {
            key: 'user_id',
            title: 'ID',
            sortable: true,
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'full_name',
            title: 'userName',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'account_lv',
            title: 'accountLevel',
            class: 'text-center',
            sortable: true,
          },
          {
            key: 'channel_name',
            title: 'registeredChannel',
            sortable: true,
          },
          {
            key: 'created_at',
            title: 'registeredDate',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD')
            },
          },
          {
            key: 'tags',
            title: 'tags',
            sortable: false,
            class: 'td-w-250px',
            render: (value) => {
              if (value) {
                return value.join(', ')
              }
              return ''
            },
          },
          {
            key: 'action',
            title: 'Tag Actions',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            key: 'tag_ids',
            title: this.$t('searchTags'),
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async function (text) {
              const result = await UserTagService.getListTags({
                search_field: 'name',
                search_text: text,
                sort: 'created_at',
                sort_type: 'DESC',
              })
              return result?.data?.data?.data
            },
            multiple: true,
          },
          {
            key: 'email',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'full_name',
            title: 'userName',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'register_date',
            startPlaceholder: 'registeredDate',
            endPlaceholder: 'registeredDate',
            searchType: DatatableSearchType.DATE_RANGE,
          },
        ],
        configPage: true,
        activeExport: checkPermission(Permission.USER_MARKETING_EXPORT),
        getExport: () => UserTagService.getUserTagExport(),
        createExport: (params) => UserTagService.createUserTagExport(params),
      } as ITableConfig,
    }
  },
  setup() {
    const addTagsForUsersModalRef = ref(null)

    const openAddTagsForUsersModal = () => {
      showModal(addTagsForUsersModalRef.value)
    }
    return {
      openAddTagsForUsersModal,
    }
  },
})
</script>
