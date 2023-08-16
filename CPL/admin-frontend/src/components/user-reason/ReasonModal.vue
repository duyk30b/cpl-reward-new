<template>
  <base-modal
    :title="reason.id ? $t('editReason') : $t('addReason')"
    :show="show"
    @close="close"
    dialogClass="modal-md"
  >
    <template v-slot:body>
      <!--begin::Form-->
      <div class="p-5">
        <form @submit="saveReason" v-if="languages">
          <!--begin::Input Name-->
          <template v-for="language in languages" :key="language">
            <div>
              <div class="form-group row">
                <label
                  for="reasonName"
                  class="col-lg-12 col-form-label fw-bold text-muted mt-2"
                  >{{ $t('reasonName') + ' (' + language + ')' }}</label
                >
                <div class="col-lg-12">
                  <input
                    required
                    type="text"
                    class="form-control form-control-sm px-5"
                    :placeholder="$t('reasonName')"
                    v-model="reason.name[language]"
                    maxlength="255"
                  />
                </div>
              </div>
            </div>
          </template>
          <!--end::Input name-->

          <div class="form-group row">
            <label
              for="reasonCategory"
              class="col-lg-12 col-form-label fw-bold text-muted"
              >{{ $t('reasonCategory') }}</label
            >
            <div class="col-lg-12">
              <el-select
                class="input-group-search-key"
                v-model="reason.category_id"
                filterable
                clearable
                remote
                reserve-keyword
                :placeholder="$t('reasonCategory')"
                remote-show-suffix
                :remote-method="filter"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="reasonCategory in reasonCategoriesToSearch"
                  :key="reasonCategory.id"
                  :label="reasonCategory.label"
                  :value="reasonCategory.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>

          <!--begin::Actions-->
          <div class="mt-5 mb-0">
            <button
              type="submit"
              class="btn btn-primary w-100"
              id="kt_reason_create_button"
              :data-kt-indicator="loading ? 'on' : null"
              :disabled="loading"
            >
              <!--begin::Indicator-->
              <span class="indicator-label">{{ $t('saveReason') }}</span>
              <span class="indicator-progress">
                {{ $t('pleaseWait') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                >
                </span>
              </span>
              <!--end::Indicator-->
            </button>
          </div>
          <!--end::Actions-->
        </form>
      </div>
      <!--end::Form-->
    </template>
  </base-modal>
</template>
<script>
import { onMounted, ref, toRefs } from 'vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import { ReasonService } from '@/services/ReasonService'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/modals/BaseModal.vue'

export default {
  name: 'reason-modal',
  components: { BaseModal },
  props: ['reasonToUpdate'],
  setup(props, { emit }) {
    const remoteLoading = ref(false)
    const { t } = useI18n()

    const reason = ref({})
    const languages = ref()

    const addReasonModalRef = ref(null)
    const loading = ref(false)

    const reasonCategoriesToSearch = ref([])

    const { show } = toRefs(props)
    const { reasonToUpdate } = toRefs(props)

    // Init reason entity from languages
    ReasonService.getLanguage().then((result) => {
      languages.value = result.data
      let name = {}
      if (reasonToUpdate.value && reasonToUpdate.value.id) {
        reason.value = reasonToUpdate.value
      } else {
        for (const language of languages.value) {
          name[language] = ''
        }
        reason.value = {
          name,
          category_id: null,
        }
      }
    })

    const saveReason = async (e) => {
      e.preventDefault()
      let response
      if (!reason.value.id) {
        response = await ReasonService.createReason(reason.value)

        if (response.data.success !== true) {
          ElNotification.error(t('addReasonFail'))
          return
        }

        ElNotification.success(t('addReasonSuccess'))
        emit('saved')
      } else {
        response = await ReasonService.updateReason(reason.value)

        if (response.data.success !== true) {
          ElNotification.error(t('editReasonFail'))
          return
        }

        ElNotification.success(t('editReasonSuccess'))
        emit('saved')
      }
    }

    const getReasonCategories = async (search_text = null) => {
      const response = await ReasonService.getReasonCategoryList({
        search_text: search_text,
        sort: 'created_at',
        sort_type: 'DESC',
      })
      if (response.data) {
        const remake = await response.data.data.map((category) => {
          if (category && category.id) {
            return {
              value: category.id,
              label: category.name.en,
            }
          }
        })
        reasonCategoriesToSearch.value = remake
      }
    }

    const filter = (search) => {
      remoteLoading.value = true
      getReasonCategories(search)
      remoteLoading.value = false
    }

    onMounted(async () => {
      await getReasonCategories()
    })

    return {
      addReasonModalRef,
      languages,
      reason,
      loading,
      reasonCategoriesToSearch,
      remoteLoading,
      show,

      ReasonCategoryTypeEnum,

      saveReason,
      filter,
    }
  },
}
</script>
