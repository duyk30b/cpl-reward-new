<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.groupNotification') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        v-if="supportedLangs.length"
      >
        <template v-slot:button>
          <router-link
            class="btn btn-primary me-2 mb-1"
            :to="{ name: 'groupNotification.create' }"
          >
            <i class="fas fa-plus"></i>
            {{ $t('create') }}
          </router-link>
        </template>
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>
        <template v-slot:cell-image="{ row: item }">
          <img-with-large-view :src="item.image"></img-with-large-view>
        </template>
        <template v-slot:cell-url="{ row: item }">
          <a
            target="_blank"
            :href="`${FE_URL}notification/${ENotificationType.GLOBAL}-${item.id}/${item.slug}`"
          >
            {{
              `${FE_URL}notification/${ENotificationType.GLOBAL}-${item.id}/${item.slug}`
            }}
          </a>
        </template>
        <template v-slot:cell-action="{ row: item }">
          <router-link
            v-if="checkPermission(Permission.GLOBAL_NOTIFICATION_UPDATE)"
            class="btn btn-sm btn-primary me-2 mb-1"
            :to="{ name: 'groupNotification.edit', params: { id: item.id } }"
          >
            {{ $t('edit') }}
          </router-link>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
  SortType,
} from '@/components/datatable/Datatable.vue'
import {
  checkPermission,
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { NotificationService } from '@/services/NotificationService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus, Permission } from '@/core/variables/common.enum'
import CONFIG from '@/config'
import {
  ENotificationType,
  NotificationCategory,
} from '@/models/notification/Notification'
import { Mutations } from '@/store/enums/StoreEnums'
import { MultiLanguageService } from '@/services/MultiLanguageService'
import { NotificationCategoryService } from '@/services/NotificationCategoryService'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'group-notification-index',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.groupNotification', ['menu.notification'])
  },
  async created() {
    this.$store.commit(Mutations.SHOW_API_LOADING, true)
    this.supportedLangs = await NotificationService.getSupportedLangs()
    await this.getCategories()
    this.$store.commit(Mutations.SHOW_API_LOADING, false)
  },
  components: {
    Datatable,
  },
  computed: {
    _notificationCategories(): NotificationCategory[] {
      const i18n = useI18n()
      const currentLang = i18n.locale.value
      return this.notificationCategories.map((category) => ({
        id: category.id,
        name:
          this.categoryTranslates[category.name]?.[currentLang] ||
          this.categoryTranslates[category.name]?.['en'] ||
          category.name,
      }))
    },
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) => NotificationService.getList(params),
        columns: [
          {
            key: 'no',
            title: 'no',
            class: 'text-center',
          },
          {
            key: 'image',
            title: 'image',
            class: 'td-w-200px',
          },
          ...this.supportedLangs.map((lang) => ({
            key: `title_${lang}`,
            title: `title_${lang}`,
            class: 'td-w-250px',
            hidden: lang != 'en',
            render: (value, row) => {
              return row.title[lang]
            },
          })),
          {
            key: 'is_published',
            title: 'status',
            render: (value) => {
              return value ? this.$t('sent') : this.$t('waiting')
            },
          },
          {
            key: 'url',
            title: 'url',
            class: 'td-w-350px text-wrap',
          },
          {
            key: 'notification_category_id',
            title: 'category',
            hidden: true,
            render: (value) => {
              const category = this._notificationCategories.find(
                (e) => e.id == value,
              )
              return category?.name || this.$t('unknown')
            },
          },
          ...this.supportedLangs.map((lang) => ({
            key: `content_${lang}`,
            title: `content_${lang}`,
            class: 'td-w-250px',
            hidden: true,
            render: (value, row) => {
              return row.content[lang]
            },
          })),
          {
            key: 'is_active',
            title: 'active',
            class: 'text-center',
            sortable: true,
            render: (value) => {
              return value ? this.$t('yes') : this.$t('no')
            },
          },
          {
            key: 'need_send_push',
            title: 'push?',
            class: 'text-center',
            render: (value) => {
              return value ? this.$t('yes') : this.$t('no')
            },
          },
          {
            key: 'created_at',
            title: 'createdAt',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm')
            },
          },
          {
            key: 'publish_at',
            title: 'publishAt',
            sortable: true,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm')
            },
          },
          {
            title: 'action',
            key: 'action',
            class: 'text-center',
          },
        ],
        searchColumns: [
          {
            title: 'active',
            key: 'is_active',
            searchType: DatatableSearchType.SELECT,
            options: [
              {
                id: 1,
                name: this.$t('yes'),
              },
              {
                id: 0,
                name: this.$t('no'),
              },
            ],
          },
          {
            title: 'category',
            key: 'notification_category_id',
            searchType: DatatableSearchType.SELECT,
            options: this._notificationCategories,
          },
          ...this.supportedLangs.map(
            (lang) =>
              ({
                key: `title_${lang}`,
                title: `title_${lang}`,
                searchType: DatatableSearchType.TEXT,
              } as any),
          ),
          ...this.supportedLangs.map(
            (lang) =>
              ({
                key: `content_${lang}`,
                title: `content_${lang}`,
                searchType: DatatableSearchType.TEXT,
              } as any),
          ),
        ],
        default: {
          sort: 'created_at',
          sortType: SortType.DESC,
        },
        configPage: true,
        configColumn: true,
      }
    },
  },
  data() {
    return {
      tableReloadKey: 0,
      supportedLangs: [] as string[],
      Permission,
      FE_URL: CONFIG.FE_URL,
      ENotificationType,
      notificationCategories: [] as NotificationCategory[],
      categoryTranslates: {} as Record<string, any>,
    }
  },
  methods: {
    checkPermission,
    async getCategories() {
      const res = await NotificationCategoryService.getList()
      this.notificationCategories = res.data?.data || []
      const keys = this.notificationCategories.map((category) => category.name)
      const translates = await MultiLanguageService.getTranslatesByKeys({
        keys,
      })
      if (translates.status == HttpStatus.OK) {
        this.categoryTranslates = translates.data.reduce(
          (acc, cur) => ({ ...acc, [cur.key]: cur.translates }),
          {},
        )
      }
    },
  },
})
</script>
