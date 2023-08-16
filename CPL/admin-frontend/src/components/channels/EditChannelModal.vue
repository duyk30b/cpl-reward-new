<template>
  <BaseModal :title="modalTitle" :show="show" @close="close">
    <template v-slot:body>
      <form ref="channelForm" @submit="save">
        <div class="mb-10">
          <label for="channelName" class="form-label">{{
            $t('channelName')
          }}</label>
          <input
            type="text"
            id="channelName"
            class="form-control"
            :class="{
              'border border-danger': errorValidateChannelName,
            }"
            v-model="editChannel.name"
            required
            maxlength="255"
          />
          <div
            v-show="errorValidateChannelName"
            class="fs-7 fw-bold text-danger mt-md-2 mb-0"
          >
            {{ $t('errorValidateChannelName') }}
          </div>
        </div>
        <div class="mb-10">
          <label for="rootLink" class="form-label">
            {{ $t('rootLink') }}
          </label>
          <input
            type="text"
            class="form-control"
            list="rootLinks"
            id="rootLink"
            v-model="currentRootLink"
            autocomplete="off"
          />
          <datalist id="rootLinks">
            <option
              v-for="(link, index) in rootLinks"
              :value="link"
              :key="index"
            ></option>
          </datalist>
        </div>
        <div class="mb-10">
          <label for="channelLink" class="form-label">{{
            $t('channelLink')
          }}</label>
          <input
            type="text"
            id="channelLink"
            class="form-control"
            v-model="editChannel.link"
            required
            maxlength="255"
            readonly
            onclick="this.select()"
          />
        </div>
        <div class="mb-10">
          <label for="channelDynamicLink" class="form-label">{{
            $t('channelDynamicLink')
          }}</label>
          <input
            type="text"
            id="channelDynamicLink"
            class="form-control"
            :placeholder="$t('channelDynamicLinkPlaceHolder')"
            v-model="editChannel.dynamicLink"
            required
            maxlength="255"
            readonly
            onclick="this.select()"
          />
        </div>
        <div class="row">
          <div class="col-md-12">
            <label class="form-label">{{ $t('createNewTag') }}</label>
          </div>
          <div class="col-8">
            <input
              v-model="newTag"
              type="text"
              class="form-control mb-5"
              :placeholder="$t('enterNewTag')"
              @input="newTagNotice = ''"
              @keyup="(e) => e.keyCode === 13 && createTag()"
              maxlength="255"
            />
          </div>
          <div class="col-4">
            <button
              class="btn btn-success"
              :disabled="!this.newTag"
              @click="createTag"
            >
              {{ $t('create') }}
            </button>
          </div>

          <div
            class="col-12 mb-2"
            style="margin-top: -10px"
            v-if="newTagNotice !== ''"
          >
            <small>{{ newTagNotice }}</small>
          </div>
        </div>

        <label class="form-label">{{ $t('searchExistingTag') }}</label>
        <multiselect
          class="mb-10"
          ref="multiselect"
          v-model="tags"
          mode="tags"
          :placeholder="$t('searchTags')"
          :close-on-select="false"
          :filter-results="false"
          :min-chars="1"
          :delay="300"
          label="label"
          track-by="label"
          :searchable="true"
          :options="searchOptions"
        >
        </multiselect>
      </form>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        @click="submitForm"
        :data-kt-indicator="loading ? 'on' : ''"
        :disabled="loading || errorValidateChannelName"
      >
        {{ $t('saveChannel') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { ChannelEntity } from '@/core/data/channel'
import { UserTagService } from '@/services/UserTagService'
import { ChannelService } from '@/services/ChannelService'
import { HttpStatus } from '@/core/variables/common.enum'
import Multiselect from '@vueform/multiselect'
import { instanceToPlain } from 'class-transformer'
import CONFIG from '@/config'

export default defineComponent({
  name: 'edit-channel-modal',
  components: { BaseModal, Multiselect },
  props: {
    channel: {
      type: ChannelEntity,
      default: new ChannelEntity(),
    },
    show: Boolean,
  },
  data() {
    return {
      editChannel: this.channel,
      tags: this.channel.tagIds ? JSON.parse(this.channel.tagIds) : [],
      loading: false,
      rootLinks: CONFIG.CHANNEL_SETUP_ROOT_LINKS,
      currentRootLink: '',
      newTag: '',
      newTagNotice: '',
    }
  },
  watch: {
    tags(newVal) {
      this.editChannel.tagIds = JSON.stringify(newVal)
    },
    channel: {
      handler(newVal) {
        this.editChannel = newVal
        this.tags = newVal.tagIds ? JSON.parse(this.channel.tagIds) : []
        try {
          const urlObject = new URL(newVal.link)
          urlObject.searchParams.delete('channel')
          this.currentRootLink = urlObject.href
        } catch (e) {
          console.log(e)
        }
      },
      immediate: true,
    },
    channelName() {
      this.editChannel.link = this.generateChannelLink()
    },
    currentRootLink() {
      this.editChannel.link = this.generateChannelLink()
    },
  },
  computed: {
    modalTitle() {
      return this.channel.id ? 'editChannel' : 'addChannel'
    },
    channelName() {
      return this.editChannel.name
    },
    errorValidateChannelName() {
      return !/^([a-zA-Z0-9_]*)$/.test(this.editChannel.name)
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submitForm() {
      const channelForm = this.$refs.channelForm as HTMLFormElement
      channelForm.requestSubmit()
    },
    async save(e) {
      e.preventDefault()
      this.loading = true

      if (!this.editChannel.id) {
        const res = await ChannelService.createChannel(
          instanceToPlain(this.editChannel),
        )
        this.loading = false

        if (res.status !== HttpStatus.CREATED || res?.data?.success === false) {
          return this.$toastr.error(
            this.$t(res.data?.message || 'addChannelFailed'),
          )
        }

        this.$toastr.success(this.$t('addChannelSuccess'))
        this.$emit('updated')
        return this.close()
      }

      const res = await ChannelService.updateChannel(
        this.editChannel.id,
        instanceToPlain(this.editChannel),
      )
      this.loading = false

      if (res.status !== HttpStatus.OK) {
        return this.$toastr.error(
          this.$t(res.data?.message || 'updateChannelFailed'),
        )
      }

      this.$toastr.success(this.$t('updateChannelSuccess'))
      this.$emit('updated')
      return this.close()
    },
    async searchOptions(text) {
      const defaultTags = this.channel.tags?.length ? this.channel.tags : []

      const response = await UserTagService.getListTags({
        search_field: 'name',
        search_text: text,
        sort: 'created_at',
        sort_type: 'DESC',
      })

      if (response.status !== HttpStatus.OK) {
        return defaultTags
      }

      const searchResult = response.data.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      })

      defaultTags.forEach((tag) => {
        if (searchResult.find((item) => item.id === tag.id)) {
          return
        }

        searchResult.push({
          value: tag.id,
          label: tag.name,
        })
      })

      return searchResult
    },
    generateChannelLink() {
      try {
        const protocol = 'https://'

        if (!this.currentRootLink.includes(protocol)) {
          this.currentRootLink = protocol + this.currentRootLink
        }

        const urlObject = new URL(this.currentRootLink)
        urlObject.searchParams.append('channel', this.channelName)

        return urlObject.href
      } catch (error) {
        return ''
      }
    },
    async createTag(e) {
      e.preventDefault()

      if (!this.newTag) {
        return
      }

      if (this.newTag.length > 255) {
        return
      }

      const response = await UserTagService.createOneTag(this.newTag)
      if (response.status !== HttpStatus.CREATED) {
        this.newTagNotice = this.$t('failedAddedTagMsg')
        return
      }

      if (response?.data?.data?.is_existed) {
        this.newTagNotice = this.$t('failedCreateExistedTag')
        return
      }

      this.newTag = ''
      this.newTagNotice = this.$t('succeedAddedTagMsg')
      this.tags.push(response.data.data.id)
      const multipleSlect = this.$refs.multiselect as any
      multipleSlect.select({
        label: response.data.data.name,
        value: response.data.data.id,
      })
      multipleSlect.refreshOptions()
    },
  },
})
</script>

<style lang="scss">
.multiselect-options {
  position: sticky !important;
}
</style>
