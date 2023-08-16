<template>
  <div class="d-flex justify-content-between">
    <div class="w-50 pe-3">
      <div>{{ $t('createNewTag') }} :</div>
      <div class="d-flex justify-content-between gap-2">
        <input class="form-control form-control-sm" type="text" v-model="newTag" @input="newTagNotices = ''" />
        <button
          type="button"
          class="btn btn-success btn-sm text-nowrap"
          :disabled="createTagLoading || !newTag"
          @click="createNewTag"
        >
          {{ $t('create') }}
        </button>
      </div>
      <small>{{ newTagNotices }}</small>
    </div>
    <div class="w-50 ps-3">
      <span>{{ $t('autoTagging') }}: </span>
      <Multiselect
        ref="tagsSelector"
        v-model="tagIds"
        @change="changeValue"
        mode="tags"
        :placeholder="$t('searchTags')"
        :close-on-select="false"
        :filter-results="false"
        :min-chars="1"
        :delay="300"
        label="label"
        track-by="label"
        :searchable="true"
        :options="(text: string) => searchTags(text)"
        :key="tagForceRender"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { HttpStatus } from '@/core/variables/common.enum'
import { UserTagService } from '@/services/UserTagService'
import Multiselect from '@vueform/multiselect'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  components: { Multiselect },
  props: {
    originTagIds: { type: Array as PropType<number[]>, default: () => [] as number[] },
  },

  setup(props) {
    const tagIds = [...props.originTagIds]
    return {
      tagIds: ref<number[]>(tagIds),
      newTag: ref<string>(''),
      newTagNotices: ref<string>(''),
      tagForceRender: ref(0),
      createTagLoading: ref(false),
    }
  },

  methods: {
    changeValue(value: number[]) {
      this.$emit('update:originTagIds', value)
    },
    async createNewTag(e: Event) {
      e.preventDefault()

      this.createTagLoading = true
      const response = await UserTagService.createOneTag(this.newTag)
      this.createTagLoading = false

      if (response.status !== HttpStatus.CREATED) {
        this.newTagNotices = this.$t('failedAddedTagMsg')
        return
      }

      if (response.data.data.is_existed) {
        this.newTagNotices = this.$t('failedCreateExistedTag')
        return
      }

      this.newTag = ''
      this.newTagNotices = this.$t('succeedAddedTagMsg')

      this.tagIds.push(response.data.data.id)

      const multipleSelect = this.$refs.tagsSelector as any
      multipleSelect.select({
        label: response.data.data.name,
        value: response.data.data.id,
      })
    },

    async searchTags(text: string) {
      const existTagsResponse = await UserTagService.getTagByIds(this.tagIds)
      const tags = existTagsResponse.data.data as { id: number; name: string }[]
      const existTags = tags.map((i) => ({
        value: i.id,
        label: i.name,
      }))

      const response = await UserTagService.getListTags({
        search_field: 'name',
        search_text: text,
        sort: 'created_at',
        sort_type: 'DESC',
      })
      const data = response.data.data.data as { id: number; name: string }[]

      const result: { value: number; label: string }[] = data.map((i) => ({
        value: i.id,
        label: i.name,
      }))

      existTags.forEach((i) => {
        if (!result.find((j) => i.value === j.value)) {
          result.push(i)
        }
      })

      return result
    },
  },
})
</script>

<style>
.multiselect-placeholder {
  font-size: 13px !important;
}
</style>
