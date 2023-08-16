<template>
  <base-modal
    :title="
      reasonCategory.id ? $t('editReasonCategory') : $t('addReasonCategory')
    "
    :show="show"
    @close="close"
    dialogClass="modal-md"
  >
    <template v-slot:body>
      <!--begin::Form-->
      <div class="p-5">
        <form @submit="saveReasonCategory" v-if="languages">
          <!--begin::Input Name-->
          <template v-for="language in languages" :key="language">
            <div>
              <div class="form-group row">
                <label
                  for="reasonCategoryName"
                  class="col-lg-12 col-form-label fw-bold text-muted mt-2"
                  >{{ $t('reasonCategoryName') + ' (' + language + ')' }}</label
                >
                <div class="col-lg-12">
                  <input
                    required
                    type="text"
                    class="form-control form-control-sm px-5"
                    :id="`reasonCategoryName_${language}`"
                    :name="`name_${language}`"
                    :placeholder="$t('reasonCategoryName')"
                    v-model="reasonCategory.name[language]"
                    maxlength="255"
                  />
                </div>
              </div>
            </div>
          </template>
          <!--end::Input name-->

          <div class="form-group row">
            <label
              for="reasonCategoryType"
              class="col-lg-12 col-form-label fw-bold text-muted"
              >{{ $t('reasonCategoryType') }}</label
            >
            <div class="col-lg-12">
              <select
                required
                class="form-control form-control-sm px-5"
                v-model="reasonCategory.type"
              >
                <template
                  v-for="categoryType in getEnumValues(ReasonCategoryTypeEnum)"
                  :key="categoryType"
                >
                  <option :value="categoryType">
                    {{ $t(`reasonCategoryTypes.${categoryType}`) }}
                  </option>
                </template>
              </select>
            </div>
          </div>

          <!--begin::Actions-->
          <div class="mt-5 mb-0">
            <button
              type="submit"
              class="btn btn-primary w-100"
              id="kt_reason_category_create_button"
              :data-kt-indicator="loading ? 'on' : null"
              :disabled="loading"
            >
              <!--begin::Indicator-->
              <span class="indicator-label">{{
                $t('saveReasonCategory')
              }}</span>
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
import { ref, defineComponent, toRefs } from 'vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import { ReasonService } from '@/services/ReasonService'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getEnumValues } from '@/core/helpers/common.helper'
import BaseModal from '@/components/modals/BaseModal.vue'

export default defineComponent({
  name: 'reason-category-modal',
  components: { BaseModal },
  props: ['reasonCategoryToUpdate'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const reasonCategory = ref({})
    const languages = ref()

    const addReasonCategoryModalRef = ref(null)
    const loading = ref(false)

    const { show } = toRefs(props)
    const { reasonCategoryToUpdate } = toRefs(props)

    ReasonService.getLanguage().then((result) => {
      languages.value = result.data
      let name = {}
      if (reasonCategoryToUpdate.value && reasonCategoryToUpdate.value.id) {
        reasonCategory.value = reasonCategoryToUpdate.value
      } else {
        for (const language of languages.value) {
          name[language] = ''
        }
        reasonCategory.value = {
          name,
          type: ReasonCategoryTypeEnum.KYC_PERSONAL,
        }
      }
    })

    const saveReasonCategory = async (e) => {
      e.preventDefault()
      let response
      if (!reasonCategory.value.id) {
        response = await ReasonService.createReasonCategory(
          reasonCategory.value,
        )

        if (response.data.success !== true) {
          ElNotification.error(t('addReasonCategoryFail'))
          return
        }

        ElNotification.success(t('addReasonCategorySuccess'))
        emit('saved')
      } else {
        response = await ReasonService.updateReasonCategory(
          reasonCategory.value,
        )

        if (response.data.success !== true) {
          ElNotification.error(t('editReasonCategoryFail'))
          return
        }

        ElNotification.success(t('editReasonCategorySuccess'))
        emit('saved')
      }
    }

    return {
      addReasonCategoryModalRef,
      languages,
      reasonCategory,
      loading,
      show,

      ReasonCategoryTypeEnum,
      getEnumValues,

      saveReasonCategory,
    }
  },
})
</script>
