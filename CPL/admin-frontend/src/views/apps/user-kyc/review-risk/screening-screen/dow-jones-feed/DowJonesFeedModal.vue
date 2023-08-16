<template>
  <base-modal
    dialogClass="modal-xl"
    :show="show"
    @close="close"
    :title="`${detail?.searchResponse?.primaryName || ''} (#${
      detail?.searchResponse?.djId
    })`"
  >
    <template v-slot:body>
      <div class="section-block">
        <div class="section-header">{{ $t('lastReviewDate') }}</div>
        {{
          $filters.convertDateFormat(
            detail?.searchResponse?.modifiedOn,
            'DD-MM-YYYY',
            'YYYY-MM-DD',
          )
        }}
      </div>

      <div class="section-block" v-if="alsoKnownAs.length > 0">
        <div class="section-header">{{ $t('alsoKnownAs') }}</div>
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>{{ $t('name') }}</th>
              <th>{{ $t('suffix') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in alsoKnownAs" :key="index">
              <td>
                {{ item.firstName }} {{ item.middleName }} {{ item.surname }}
              </td>
              <td>{{ item.suffix || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-block" v-if="lowQualityAka.length > 0">
        <div class="section-header">{{ $t('lowQualityAka') }}</div>
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>{{ $t('name') }}</th>
              <th>{{ $t('suffix') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lowQualityAka" :key="index">
              <td>
                {{ item.firstName }} {{ item.middleName }} {{ item.surname }}
              </td>
              <td>{{ item.suffix || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-block" v-if="primaryName.length > 0">
        <div class="section-header">{{ $t('primaryName') }}</div>
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>{{ $t('name') }}</th>
              <th>{{ $t('suffix') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in primaryName" :key="index">
              <td>
                {{ item.firstName }} {{ item.middleName }} {{ item.surname }}
              </td>
              <td>{{ item.suffix || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-block" v-if="spellingVariation.length > 0">
        <div class="section-header">{{ $t('spellingVariation') }}</div>
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>{{ $t('name') }}</th>
              <th>{{ $t('suffix') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in spellingVariation" :key="index">
              <td>
                {{ item.firstName }} {{ item.middleName }} {{ item.surname }}
              </td>
              <td>{{ item.suffix || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-block">
        <div class="section-header">{{ $t('gender') }}</div>
        {{ detail?.searchResponse?.gender || '-' }}
      </div>

      <div class="section-block">
        <div class="section-header">{{ $t('sanction') }}</div>
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>
                {{ $t('sanction') }}
              </th>
              <th>{{ $t('description') }}</th>
              <th>{{ $t('since') }}</th>
              <th>{{ $t('to') }}</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-if="detail?.searchResponse?.sanctionsReferences?.length"
            >
              <tr
                v-for="(item, i) in detail.searchResponse.sanctionsReferences"
                :key="i"
              >
                <td>{{ item.sanction }}</td>
                <td>{{ item.description }}</td>
                <td>
                  {{ item.sinceDay && item.sinceDay + '/'
                  }}{{ item.sinceMonth && item.sinceMonth + '/'
                  }}{{ item.sinceYear }}
                </td>
                <td>
                  {{ item.toDay && item.toDay + '/'
                  }}{{ item.toMonth && item.toMonth + '/' }}{{ item.toYear }}
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="4" class="text-center text-muted">
                {{ $t('noData') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-block">
        <div class="section-header">{{ $t('additionalDetail') }}</div>
        <ul>
          <li
            v-for="item in detail?.searchResponse?.countryDetail"
            :key="item.type"
          >
            <span class="fw-bold">{{ item.type }}:</span>
            {{ item.country }}
          </li>
        </ul>
      </div>
      <div class="section-block">
        <div class="section-header">{{ $t('sourceDetail') }}</div>
        <ul>
          <li
            v-for="(item, i) in detail?.searchResponse?.sourceDescription"
            :key="i"
          >
            <a :href="getSourceDetail(item).link" target="_blank">
              {{ getSourceDetail(item).title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="section-block">
        <div class="section-header">{{ $t('profileNote') }}</div>
        <span class="profile-note">
          {{ detail?.searchResponse?.profileNotes }}
        </span>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IDJDataResult } from '@/models/user/UserKycScanData'
import BaseModal from '@/components/modals/BaseModal.vue'

export default defineComponent({
  name: 'dow-jones-feed-modal',
  components: { BaseModal },
  props: {
    show: {
      type: Boolean,
    },
    detail: {
      type: Object as PropType<IDJDataResult>,
    },
  },
  computed: {
    nameDetail() {
      return this.detail?.searchResponse?.nameDetail || []
    },
    alsoKnownAs() {
      return this.nameDetail.filter((e) => e.type.includes('Also'))
    },
    lowQualityAka() {
      return this.nameDetail.filter((e) => e.type.includes('Low'))
    },
    spellingVariation() {
      return this.nameDetail.filter((e) => e.type.includes('Spelling'))
    },
    primaryName() {
      return this.nameDetail.filter((e) => e.type.includes('Primary'))
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getSourceDetail(source: string) {
      const [text, title, link] =
        source.match(/^(.*?)\((https*:\/\/.*?)\)$/) || []
      return {
        text,
        title,
        link,
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.section-block:not(:last-child) {
  border-bottom: 1px dashed #ddd;
}
.profile-note {
  white-space: pre-wrap;
}
</style>
