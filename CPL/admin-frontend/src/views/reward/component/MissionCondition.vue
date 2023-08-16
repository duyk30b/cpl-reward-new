<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr class="fw-bolder text-muted bg-light">
          <th class="ps-4 w-50">{{ $t('property') }}</th>
          <th class="w-10">{{ $t('operator') }}</th>
          <th class="w-10">{{ $t('value') }}</th>
          <th class="text-end pe-4 w-25">{{ $t('action') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(condition, index) in conditions" :key="index">
          <td>
            <select
              required
              class="form-control form-control-sm"
              v-model="conditions[index].property"
              @change="(e) => handleChangeProperty(e, index)"
            >
              <option v-for="(content, key) in DATA" :key="key" :value="key">
                {{ key }} ({{ content.display || content.type }}
                {{ content.description || content.label ? '- ' + (content.description || content.label) : '' }})
              </option>
            </select>
          </td>

          <td>
            <select
              v-if="['boolean', 'string'].includes(condition.type || '')"
              required
              class="form-control form-control-sm"
              v-model="conditions[index].operator"
              @change="updatePropCondition"
            >
              <option value="==">=</option>
              <option value="!=">&ne;</option>
            </select>

            <select
              v-if="['number', 'unix_timestamp', 'enum'].includes(condition.type || '')"
              v-model="conditions[index].operator"
              @change="updatePropCondition"
              required
              class="form-control form-control-sm"
            >
              <option value="==">=</option>
              <option value="!=">&ne;</option>
              <option value=">">&gt;</option>
              <option value=">=">&ge;</option>
              <option value="<=">&le;</option>
              <option value="<">&lt;</option>
            </select>
          </td>

          <td class="w-25">
            <input
              v-if="condition.display === 'string'"
              v-model="conditions[index].value"
              @change="updatePropCondition"
              required
              class="form-control form-control-sm w-100"
              maxlength="255"
            />

            <select
              v-if="condition.display === 'boolean'"
              v-model="conditions[index].value"
              @change="updatePropCondition"
              required
              class="form-control form-control-sm"
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>

            <select
              v-if="condition.display === 'enum'"
              v-model="conditions[index].value"
              @change="updatePropCondition"
              required
              class="form-control form-control-sm"
            >
              <option
                v-for="(enumValue, enumKey) in DATA[condition.property].options"
                :value="enumValue"
                :key="enumKey"
              >
                {{ enumKey }}
              </option>
            </select>

            <input
              v-if="condition.display === 'number'"
              v-model.number="conditions[index].value"
              @change="updatePropCondition"
              type="number"
              required
              class="form-control form-control-sm"
            />

            <input
              v-if="condition.display === 'unix_timestamp'"
              v-model="conditions[index].value"
              @change="updatePropCondition"
              type="number"
              required
              step="1"
              min="1000000000000"
              max="9999999999999"
              class="form-control form-control-sm"
            />

            <select
              required
              v-if="condition.display === 'select'"
              v-model="conditions[index].value"
              @change="updatePropCondition"
              class="form-control form-control-sm w-100"
            >
              <option v-for="option in selectOptions[condition.property]" :value="option.id" :key="option.id">
                {{ option.name }}
              </option>
            </select>
          </td>

          <td class="text-end">
            <div
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
              @click="conditions.push({ ...condition }) && updatePropCondition()"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="media/icons/duotune/general/gen054.svg" />
              </span>
            </div>
            <div
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              @click="conditions.splice(index, 1) && updatePropCondition()"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="media/icons/duotune/general/gen027.svg" />
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { getAllCountries } from '@/core/helpers/common.helper'
import { defineComponent, PropType, ref } from 'vue'
import { TRules } from '../store/mission-condition.store'

type ICondition = {
  property: string
  operator: string
  type: string
  value: string
  display: string
}

export default defineComponent({
  props: {
    propConditions: { type: String, default: () => '[]' },
    DATA: { type: Object as PropType<TRules>, default: () => ({ x: {} }) },
  },
  setup(props) {
    const conditions = JSON.parse(props.propConditions) as ICondition[]
    return {
      conditions: ref<ICondition[]>(conditions),
      selectOptions: {
        'user_info.nationality_id': getAllCountries()
          .sort((a: any, b: any) => a.id - b.id)
          .map((e: any) => ({ id: e.id, name: `${e.name} (${e.id})` })),
      },
    }
  },

  watch: {
    // propConditions: {
    //   handler: function (newValue) {
    //     this.conditions = JSON.parse(newValue)
    //   },
    //   immediate: true,
    // },
    DATA(newValue: TRules) {
      this.conditions.forEach((i) => {
        i.type = newValue[i.property]?.type
        i.display = newValue[i.property]?.display || this.DATA[i.property]?.type
      })
    },
    // conditions: {
    //   handler: function (newValue: ICondition[]) {
    //     this.$emit('update:propConditions', JSON.stringify(newValue))
    //   },
    //   deep: true,
    // },
  },

  methods: {
    updatePropCondition() {
      const data = this.conditions.map((i) => ({
        property: i.property,
        operator: i.operator,
        type: i.type,
        value: i.value,
      }))
      this.$emit('update:propConditions', JSON.stringify(data))
    },

    handleChangeProperty(e: Event, index: number) {
      const target = e.target as HTMLSelectElement
      this.conditions[index].type = this.DATA[target.value]?.type
      this.conditions[index].display = this.DATA[target.value]?.display || this.DATA[target.value]?.type

      this.updatePropCondition()
    },
  },
})
</script>
