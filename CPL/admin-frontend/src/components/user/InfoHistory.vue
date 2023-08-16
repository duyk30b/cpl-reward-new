<template>
  <div class="history-side-bar" :class="{ show: show }">
    <div class="history-header">
      <button class="btn close-side-bar" @click="$emit('close')">
        <i class="fas fa-times p-0"></i>
      </button>
      {{ $t('kycHistory') }}
    </div>
    <div class="history-body">
      <div v-if="loading" class="py-5 text-center">
        <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
      </div>
      <div v-if="!histories?.length" class="py-5 text-center">
        {{ $t('noData') }}
      </div>
      <template v-else>
        <div
          class="history-item latest"
          v-if="histories?.length"
          @click="selectCurrentVersion"
        >
          <i class="fas fa-circle"></i>
          <div>
            <div class="history-time">
              {{ $filters.convertTimestampToDate(histories[0].createdAt) }}
            </div>
            <div>
              {{ $t('latest') }}
            </div>
            <div class="history-modifier">
              {{ $t('updatedBy') }}
              <b>{{ histories[0].isModifiedByUser ? 'User' : 'Admin' }}</b>
            </div>
          </div>
        </div>
        <div class="border-bottom px-3 py-3">
          <v-select
            v-model="selectedTags"
            :options="allTagOptions"
            optionLabel="name"
            optionValue="id"
            multiple
          ></v-select>
        </div>
        <div
          class="history-item"
          v-for="(history, i) in displayHistories"
          :key="i"
          :class="{
            active: history.id == currentHistoryId,
          }"
          @click="select(history)"
        >
          <i class="fas fa-circle"></i>
          <div>
            <div class="history-time">
              {{ $filters.convertTimestampToDate(history.createdAt) }}
            </div>
            <div class="history-modifier mb-1">
              {{ $t('updatedBy') }}
              <b>{{ history.isModifiedByUser ? 'User' : 'Admin' }}</b>
            </div>
            <div class="history-modified-tags ps-4">
              <div v-for="tag in history.modifiedTags" :key="tag">
                <i class="fas fa-tag text-secondary me-2"></i> {{ $t(tag) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!displayHistories.length" class="py-5 text-center">
          {{ $t('noData') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserInfoService } from '@/services/UserInfoService'
import { UserInfo, UserInfoHistory } from '@/models/user/UserInfo'
import { UserKyc } from '@/models/user/UserKyc'
import { instanceToInstance } from 'class-transformer'

export default defineComponent({
  emits: ['close', 'selectHistory', 'selectCurrentVersion'],
  name: 'info-history',
  async mounted() {
    await this.getData()
  },
  watch: {
    userId: async function () {
      await this.getData()
    },
  },
  props: {
    currentUserInfo: {
      type: UserInfo,
    },
    currentUserKyc: {
      type: UserKyc,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    currentHistoryId: '',
    selectedTags: [] as string[],
    histories: [] as UserInfoHistory[],
    loading: false,
    allTags: [
      'idDocumentNo',
      'files',
      'buildingRoom',
      'address',
      'city',
      'stateRegion',
      'zipCode',
      'nationalityId',
      'countryId',
      'furigana',
      'birthday',
      'phoneNumber',
      'firstName',
      'lastName',
      'gender',
      'remark',
    ],
  }),
  computed: {
    userId() {
      return this.currentUserInfo?.userId as string
    },
    displayHistories() {
      if (!this.histories) return []
      if (!this.selectedTags?.length) return this.histories
      return this.histories.filter((history) => {
        return (history.modifiedTags || []).some((tag) =>
          this.selectedTags.includes(tag),
        )
      })
    },
    allTagOptions() {
      return this.allTags.map((tag) => ({
        id: tag,
        name: this.$t(tag),
      }))
    },
  },
  methods: {
    async getUserInfoHistory() {
      this.histories = await UserInfoService.getListUserInfoHistory(this.userId)
    },
    async getData() {
      if (!this.userId) return
      this.loading = true
      await this.getUserInfoHistory()
      this.processHistoriesData()

      const userKycHistoryId = this.$route.query?.kyc_history_id
      if (userKycHistoryId) {
        const infoHistory = this.histories.find(
          (e) => e.userKycHistory?.userKycHistoryId == userKycHistoryId,
        )
        if (infoHistory) this.select(infoHistory)
      }

      this.loading = false
    },
    select(history: UserInfoHistory) {
      this.currentHistoryId = history.id
      this.$emit('selectHistory', history)
    },
    getHistoryModifiedTags(
      history1: UserInfoHistory,
      history2: UserInfoHistory,
    ) {
      if (!history1 || !history2) return []
      let tags = [] as string[]

      Object.keys(history1).forEach((key) => {
        if (this.allTags.includes(key) && history1[key] != history2[key]) {
          tags.push(key)
        }
      })
      if (
        history1.furigana1 != history2.furigana1 ||
        history1.furigana2 != history2.furigana2
      ) {
        tags.push('furigana')
      }
      if (history1.phoneNumber != history2.phoneNumber) {
        tags.push('phoneNumber')
      }

      const userKycHistory1 = history1.userKycHistory
      const userKycHistory2 = history2.userKycHistory
      if (userKycHistory1 || userKycHistory2) {
        if (
          JSON.stringify(userKycHistory1?.files) !=
          JSON.stringify(userKycHistory2?.files)
        ) {
          tags.push('files')
        }

        if (userKycHistory1?.idDocumentNo != userKycHistory2?.idDocumentNo) {
          tags.push('idDocumentNo')
        }
      }
      return tags
    },
    processHistoriesData() {
      if (!this.histories?.length) return
      for (let i = this.histories.length - 1; i >= 0; i--) {
        const history = this.histories[i]
        if (!history.userKycHistory && this.histories[i + 1]?.userKycHistory) {
          history.userKycHistory = instanceToInstance(
            this.histories[i + 1].userKycHistory,
            {
              ignoreDecorators: true,
            },
          )
          history.userKycHistory.id = '0'
        }
        history.modifiedTags = this.getHistoryModifiedTags(
          history,
          this.histories[i + 1],
        )
      }
    },
    selectCurrentVersion() {
      this.$emit('selectCurrentVersion')
      this.currentHistoryId = ''
    },
    selectLatestHistory() {
      if (!this.histories?.length) return
      this.select(this.histories[0])
    },
  },
})
</script>

<style lang="scss" scoped>
.history-side-bar {
  position: fixed;
  top: 0;
  right: -305px;
  width: 300px;
  height: 100vh;
  box-shadow: -1px 0 10px #ccc;
  background-color: #ffffff;
  z-index: 100;
  transition: right 0.5s ease;

  &.show {
    right: 0;
  }
  .history-header {
    font-size: 1.1em;
    height: 55px;
    background-color: #1a1a27;
    color: white;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    padding: 0.5rem 1rem 0.5rem 0;
    font-weight: 500;

    .close-side-bar {
      color: white;
      i {
        font-size: 1.2em;
      }
    }
  }

  .history-body {
    height: calc(100vh - 55px);
    max-height: calc(100vh - 55px);
    overflow: auto;

    .history-item {
      padding: 10px 20px;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.9em;

      &:hover {
        background-color: #efefef;
      }

      &.latest {
        color: #1ea1f2;
        background-color: #e9f6fe;
      }

      &.active {
        background-color: #efefef;
      }

      i {
        font-size: 0.8em;
        margin-right: 23px;
      }

      .history-time {
        font-size: 1em;
        font-weight: bold;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #eff2f5;
      }
    }
  }
}
</style>
