<template>
  <base-modal dialogClass="modal-xl" :show="show" @close="close" title="detail">
    <template v-slot:body>
      <table class="table align-middle gs-0 gy-5">
        <tbody>
          <tr>
            <td class="text-uppercase text-header">{{ $t('summary') }}</td>
            <td>{{ detail.nlpJson.summary || '-' }}</td>
          </tr>
          <tr>
            <td class="text-uppercase text-header">{{ $t('top3NamesHit') }}</td>
            <td>
              <template v-if="detail?.nlpJson?.ner">
                <div v-for="i in [0, 1, 2]" :key="i">
                  <span class="text-uppercase text-header">
                    {{ $t('nameHit') }} #{{ i + 1 }}:
                  </span>
                  <span>
                    {{
                      detail.nlpJson.ner?.allNamesHit
                        ? detail.nlpJson.ner.allNamesHit?.[i]?.[0]
                        : ''
                    }}
                    ({{ $t('confidence') }}
                    {{
                      parseFloat(
                        detail.nlpJson.ner?.allNamesHit
                          ? (data.nlpJson.ner.allNamesHit?.[i]?.[1] || 0) * 100
                          : 0,
                      ).toFixed(2)
                    }}%)
                  </span>
                </div>
              </template>
              <template v-else>-</template>
            </td>
          </tr>
          <tr>
            <td class="text-uppercase text-header">
              {{ $t('sentimentClass') }}
            </td>
            <td>
              {{
                detail?.nlpJson?.sentiment?.class
                  ? data.nlpJson.sentiment.class
                  : '-'
              }}
            </td>
          </tr>
          <tr>
            <td class="text-uppercase text-header">
              {{ $t('sentimentHitSnapshot') }}
            </td>
            <td>
              <div class="content-area" v-if="mapContent.length">
                <div
                  v-for="(item, index) of mapContent"
                  :key="index"
                  v-html="item"
                ></div>
              </div>
              <template v-else>-</template>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IInternetSearchDataResult } from '@/models/user/UserKycScanData'
import BaseModal from '@/components/modals/BaseModal.vue'
import { escapeHtml } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'internet-search-modal',
  components: { BaseModal },
  props: {
    show: {
      type: Boolean,
    },
    detail: {
      type: Object as PropType<IInternetSearchDataResult>,
    },
  },
  computed: {
    mapContent() {
      const dataString = [] as string[]
      if (this.detail?.nlpJson?.sentiment) {
        this.detail.nlpJson.sentiment.hits.forEach((element) => {
          dataString.push('...')
          let string = escapeHtml(element[0])
          element[1].forEach((str) => {
            str = escapeHtml(str)
            string = string.replace(
              str,
              `<span class="bg-warning">${str}</span>`,
            )
          })
          dataString.push(string)
        })
        dataString.push('...')
      }
      return dataString
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
.content-area {
  max-height: 444px;
  overflow-y: auto;
  background: rgba(234, 234, 234, 0.63);
  padding: 10px;
}
table {
  tbody {
    tr {
      td:first-child {
        width: 300px;
      }
    }
  }
}
</style>
